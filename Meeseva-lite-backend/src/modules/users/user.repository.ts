import type { User } from './user.model.js';
import { UserModel } from './user.model.js';
import type { IUserRepository } from '../../domain/interfaces/user.repository.interface.js';

export class UserRepository implements IUserRepository {
  async create(user: Partial<User>) {
    return UserModel.create(user);
  }

  async findByEmail(email: string) {
    return UserModel.findOne({ email: email.toLowerCase() }).lean();
  }

  async findByPhone(phone: string) {
    return UserModel.findOne({ phone }).lean();
  }

  async findByLoginIdentifier(loginIdentifier: string) {
    return UserModel.findOne({
      $or: [
        { desiredLoginId: loginIdentifier },
        { mobileNumber: loginIdentifier },
        { phone: loginIdentifier },
        { email: loginIdentifier.toLowerCase() },
      ],
    }).lean();
  }

  async findById(userId: string) {
    return UserModel.findById(userId).lean();
  }

  async updatePassword(userId: string, passwordHash: string) {
    return UserModel.findByIdAndUpdate(
      userId,
      { passwordHash },
      { returnDocument: 'after' }
    ).lean();
  }

  async updateProfile(userId: string, data: Partial<User>) {
    return UserModel.findByIdAndUpdate(userId, data, {
      returnDocument: 'after',
    }).lean();
  }

  async addSavedService(userId: string, serviceId: number) {
    return UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { savedServices: serviceId } },
      { returnDocument: 'after' }
    ).lean();
  }

  async removeSavedService(userId: string, serviceId: number) {
    return UserModel.findByIdAndUpdate(
      userId,
      { $pull: { savedServices: serviceId } },
      { returnDocument: 'after' }
    ).lean();
  }

  async getSavedServices(userId: string): Promise<number[]> {
    const user = await UserModel.findById(userId)
      .select('savedServices')
      .lean();
    return (user?.savedServices as number[]) || [];
  }
}

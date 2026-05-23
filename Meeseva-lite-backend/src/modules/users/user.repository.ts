import type { User } from './user.model.js';
import { UserModel } from './user.model.js';

export class UserRepository {
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
      { new: true }
    ).lean();
  }

  async updateProfile(userId: string, data: Partial<User>) {
    return UserModel.findByIdAndUpdate(userId, data, { new: true }).lean();
  }

  async addSavedService(userId: string, serviceId: number) {
    return UserModel.findByIdAndUpdate(
      userId,
      { $addToSet: { savedServices: serviceId } },
      { new: true }
    ).lean();
  }

  async removeSavedService(userId: string, serviceId: number) {
    return UserModel.findByIdAndUpdate(
      userId,
      { $pull: { savedServices: serviceId } },
      { new: true }
    ).lean();
  }

  async getSavedServices(userId: string) {
    const user = await UserModel.findById(userId).select('savedServices').lean();
    return user?.savedServices || [];
  }
}
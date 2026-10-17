import type { User } from '../../modules/users/user.model.js';

export interface IUserRepository {
  create(user: Partial<User>): Promise<any>;
  findByEmail(email: string): Promise<any>;
  findByPhone(phone: string): Promise<any>;
  findByLoginIdentifier(loginIdentifier: string): Promise<any>;
  findById(userId: string): Promise<any>;
  updatePassword(userId: string, passwordHash: string): Promise<any>;
  updateProfile(userId: string, data: Partial<User>): Promise<any>;
  addSavedService(userId: string, serviceId: number): Promise<any>;
  removeSavedService(userId: string, serviceId: number): Promise<any>;
  getSavedServices(userId: string): Promise<number[]>;
}

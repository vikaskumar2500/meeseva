import { AppError } from '../../common/errors/app-error.js';
import { UserRepository } from './user.repository.js';

export class UserService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async getProfile(userId: string) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    return user;
  }
  
   async updateProfile(userId: string, data: any) {
     const user = await this.userRepository.updateProfile(userId, data);
     if (!user) {
       throw new AppError(404, 'User not found');
     }
     return user;
   }
  
   async changePassword(userId: string, currentPassword: string, newPassword: string) {
     const user = await this.userRepository.findById(userId);
     if (!user) {
       throw new AppError(404, 'User not found');
     }
     
     const bcrypt = await import('bcryptjs');
     const isPasswordValid = await bcrypt.default.compare(currentPassword, user.passwordHash);
     if (!isPasswordValid) {
       throw new AppError(401, 'Current password is incorrect');
     }
     
     const passwordHash = await bcrypt.default.hash(newPassword, 12);
     await this.userRepository.updatePassword(userId, passwordHash);
   }
  
   async addSavedService(userId: string, serviceId: number) {
     const user = await this.userRepository.addSavedService(userId, serviceId);
     if (!user) {
       throw new AppError(404, 'User not found');
     }
     return user;
   }
  
   async removeSavedService(userId: string, serviceId: number) {
     const user = await this.userRepository.removeSavedService(userId, serviceId);
     if (!user) {
       throw new AppError(404, 'User not found');
     }
     return user;
   }
  
   async getSavedServices(userId: string) {
     return this.userRepository.getSavedServices(userId);
   }
  
   async addTrustedDocument(userId: string, name: string, issuer: string, verified: boolean = false) {
     const user = await this.userRepository.findById(userId);
     if (!user) {
       throw new AppError(404, 'User not found');
     }
     
     if (!user.trustedDocuments) {
       user.trustedDocuments = [];
     }
     
     user.trustedDocuments.push({ name, issuer, verified });
     return this.userRepository.updateProfile(userId, { trustedDocuments: user.trustedDocuments });
   }
  
   async getApplicationStats(userId: string) {
     const user = await this.userRepository.findById(userId);
     if (!user) {
       throw new AppError(404, 'User not found');
     }
     
     return user.applicationHistory || {
       totalApplications: 0,
       totalApproved: 0,
       totalRejected: 0,
       totalPending: 0,
     };
   }
}
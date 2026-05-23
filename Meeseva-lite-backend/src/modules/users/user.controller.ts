import type { RequestHandler } from 'express';
import { UserService } from './user.service.js';

export class UserController {
  constructor(private readonly userService = new UserService()) {}

  me: RequestHandler = async (request, response, next) => {
    try {
      const user = await this.userService.getProfile(request.user!.id);
      response.json({ user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update user profile
   */
  updateProfile: RequestHandler = async (request, response, next) => {
    try {
      if (!request.user) {
        throw new Error('Unauthorized');
      }
      const user = await this.userService.updateProfile(request.user.id, request.body);
      response.json({ user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Change password
   */
  changePassword: RequestHandler = async (request, response, next) => {
    try {
      if (!request.user) {
        throw new Error('Unauthorized');
      }
      await this.userService.changePassword(
        request.user.id,
        request.body.currentPassword,
        request.body.newPassword
      );
      response.json({ message: 'Password changed successfully' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Add service to saved services
   */
  addSavedService: RequestHandler = async (request, response, next) => {
    try {
      if (!request.user) {
        throw new Error('Unauthorized');
      }
      const user = await this.userService.addSavedService(request.user.id, request.body.serviceId);
      response.json({ user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Remove service from saved services
   */
  removeSavedService: RequestHandler = async (request, response, next) => {
    try {
      if (!request.user) {
        throw new Error('Unauthorized');
      }
      const user = await this.userService.removeSavedService(request.user.id, Number(request.params.serviceId));
      response.json({ user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get saved services
   */
  getSavedServices: RequestHandler = async (request, response, next) => {
    try {
      if (!request.user) {
        throw new Error('Unauthorized');
      }
      const services = await this.userService.getSavedServices(request.user.id);
      response.json({ data: services });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Add trusted document
   */
  addTrustedDocument: RequestHandler = async (request, response, next) => {
    try {
      if (!request.user) {
        throw new Error('Unauthorized');
      }
      const user = await this.userService.addTrustedDocument(
        request.user.id,
        request.body.name,
        request.body.issuer,
        request.body.verified
      );
      response.json({ user });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get application statistics
   */
  getApplicationStats: RequestHandler = async (request, response, next) => {
    try {
      if (!request.user) {
        throw new Error('Unauthorized');
      }
      const stats = await this.userService.getApplicationStats(request.user.id);
      response.json(stats);
    } catch (error) {
      next(error);
    }
  };
}

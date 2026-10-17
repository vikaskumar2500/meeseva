import { Router } from 'express';
import { requireAuth } from '../../common/middlewares/auth.js';
import { UserController } from './user.controller.js';

const router = Router();
const userController = new UserController();

router.get('/me', requireAuth, userController.me);
// Update profile
router.patch('/me', requireAuth, userController.updateProfile);

// Change password
router.post('/change-password', requireAuth, userController.changePassword);

// Saved services
router.get('/saved-services', requireAuth, userController.getSavedServices);
router.post('/saved-services', requireAuth, userController.addSavedService);
router.delete(
  '/saved-services/:serviceId',
  requireAuth,
  userController.removeSavedService
);

// Trusted documents
router.post(
  '/trusted-documents',
  requireAuth,
  userController.addTrustedDocument
);

// Application stats
router.get('/stats', requireAuth, userController.getApplicationStats);

export { router as userRoutes };

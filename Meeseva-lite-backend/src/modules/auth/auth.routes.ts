import { Router } from 'express';
import { validate } from '../../common/middlewares/validate.js';
import { AuthController } from './auth.controller.js';
import {
  loginSchema,
  registerSchema,
  initiateRegisterSchema,
  verifyRegisterOtpSchema,
  initiateForgotPasswordSchema,
  verifyForgotPasswordSchema,
} from './auth.validation.js';

const router = Router();
const authController = new AuthController();

// OTP-based registration flow
router.post('/register/initiate', validate(initiateRegisterSchema), authController.initiateRegister);
router.post('/register/verify-otp', validate(verifyRegisterOtpSchema), authController.verifyRegisterOtp);

// Login
router.post('/login', validate(loginSchema), authController.login);

// OTP-based forgot password flow
router.post('/forgot-password/initiate', validate(initiateForgotPasswordSchema), authController.initiateForgotPassword);
router.post('/forgot-password/verify-otp', validate(verifyForgotPasswordSchema), authController.verifyForgotPassword);

// Old registration flow (backward compatibility)
router.post('/register', validate(registerSchema), authController.register);

export { router as authRoutes };
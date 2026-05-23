import type { RequestHandler } from 'express';
import { AuthService } from './auth.service.js';

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  // Step 1: Initiate registration (send OTP)
  initiateRegister: RequestHandler = async (request, response, next) => {
    try {
      const result = await this.authService.initiateRegister(request.body);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  // Step 2: Verify OTP and complete registration
  verifyRegisterOtp: RequestHandler = async (request, response, next) => {
    try {
      const result = await this.authService.verifyRegisterOtp(request.body);
      response.status(201).json({ user: result.user, token: result.token });
    } catch (error) {
      next(error);
    }
  };

  // Login with email/phone and password
  login: RequestHandler = async (request, response, next) => {
    try {
      const result = await this.authService.login(request.body);
      response.json({ user: result.user, token: result.token });
    } catch (error) {
      next(error);
    }
  };

  // Step 1: Forgot password - send OTP
  initiateForgotPassword: RequestHandler = async (request, response, next) => {
    try {
      const result = await this.authService.initiateForgotPassword(request.body);
      response.status(200).json(result);
    } catch (error) {
      next(error);
    }
  };

  // Step 2: Verify OTP and reset password
  verifyForgotPassword: RequestHandler = async (request, response, next) => {
    try {
      const result = await this.authService.verifyForgotPasswordOtp(request.body);
      response.json(result);
    } catch (error) {
      next(error);
    }
  };

  // Register with full details (old flow - backward compatibility)
  register: RequestHandler = async (request, response, next) => {
    try {
      const result = await this.authService.register(request.body);
      response.status(201).json({ user: result.user, token: result.token });
    } catch (error) {
      next(error);
    }
  };
}
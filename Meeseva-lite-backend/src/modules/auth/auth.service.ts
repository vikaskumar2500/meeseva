import bcrypt from 'bcryptjs';
import { AppError } from '../../common/errors/app-error.js';
import { signAccessToken } from '../../common/utils/jwt.js';
import { env } from '../../config/env.js';
import type { IUserRepository } from '../../domain/interfaces/user.repository.interface.js';
import type { IOtpRepository } from '../../domain/interfaces/otp.repository.interface.js';
import type { INotificationService } from '../../domain/interfaces/notification.provider.interface.js';
import { UserRepository } from '../users/user.repository.js';
import { OTPRepository } from './otp.repository.js';
import { NotificationService } from '../../infrastructure/notifications/notification.service.js';
import {
  TwilioSmsProvider,
  MockSmsProvider,
} from '../../infrastructure/notifications/sms/sms.providers.js';
import {
  SendGridEmailProvider,
  MockEmailProvider,
} from '../../infrastructure/notifications/email/email.providers.js';

const defaultNotificationService = new NotificationService(
  [new TwilioSmsProvider(), new MockSmsProvider()],
  [new SendGridEmailProvider(), new MockEmailProvider()]
);

export class AuthService {
  constructor(
    private readonly userRepository: IUserRepository = new UserRepository(),
    private readonly otpRepository: IOtpRepository = new OTPRepository(),
    private readonly notificationService: INotificationService = defaultNotificationService
  ) {}

  /**
   * Generate a 6-digit OTP
   */
  private generateOTP(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Initiate registration - Send OTP
   */
  async initiateRegister(input: {
    fullName: string;
    email: string;
    phone: string;
  }) {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    const existingPhone = await this.userRepository.findByPhone(input.phone);
    if (existingPhone) {
      throw new AppError(409, 'Phone number already registered');
    }

    const otp = this.generateOTP();
    await this.otpRepository.create({
      email: input.email,
      phone: input.phone,
      code: otp,
      purpose: 'registration',
    });

    await this.notificationService.sendOtp({
      phone: input.phone,
      email: input.email,
      otp,
      purpose: 'registration',
    });

    return {
      message: 'OTP sent successfully',
      phone: input.phone,
      expiresIn: 600,
      ...(env.NODE_ENV !== 'production' ? { devOtp: otp } : {}),
    };
  }

  /**
   * Verify OTP and complete registration
   */
  async verifyRegisterOtp(input: {
    email: string;
    phone: string;
    otp: string;
    fullName: string;
    password: string;
    role?: 'citizen' | 'officer' | 'admin';
  }) {
    const otpRecord = await this.otpRepository.verify({
      email: input.email,
      phone: input.phone,
      code: input.otp,
      purpose: 'registration',
    });

    if (!otpRecord) {
      throw new AppError(400, 'Invalid or expired OTP');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await this.userRepository.create({
      fullName: input.fullName,
      email: input.email.toLowerCase(),
      phone: input.phone,
      passwordHash,
      role: input.role || 'citizen',
      otpVerified: true,
    });

    await this.otpRepository.deleteByEmail(input.email, 'registration');
    await this.otpRepository.deleteByPhone(input.phone, 'registration');

    const token = signAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  /**
   * Login with email/phone and password
   */
  async login(input: { loginId: string; password: string }) {
    let user = await this.userRepository.findByEmail(input.loginId);
    if (!user) {
      user = await this.userRepository.findByPhone(input.loginId);
    }

    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      input.password,
      user.passwordHash
    );
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    const token = signAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }

  /**
   * Initiate forgot password - Send OTP
   */
  async initiateForgotPassword(input: { loginId: string }) {
    let user = await this.userRepository.findByEmail(input.loginId);
    let phone = user?.phone;

    if (!user) {
      user = await this.userRepository.findByPhone(input.loginId);
      phone = input.loginId;
    }

    if (!user || !phone) {
      throw new AppError(404, 'User not found');
    }

    const otp = this.generateOTP();
    await this.otpRepository.create({
      email: user.email,
      phone: phone,
      code: otp,
      purpose: 'password_reset',
    });

    await this.notificationService.sendOtp({
      phone,
      email: user.email,
      otp,
      purpose: 'password_reset',
    });

    return {
      message: 'OTP sent successfully',
      phone: phone,
      expiresIn: 600,
      ...(env.NODE_ENV !== 'production' ? { devOtp: otp } : {}),
    };
  }

  /**
   * Verify forgot password OTP and reset password
   */
  async verifyForgotPasswordOtp(input: {
    loginId: string;
    otp: string;
    newPassword: string;
  }) {
    let user = await this.userRepository.findByEmail(input.loginId);
    if (!user) {
      user = await this.userRepository.findByPhone(input.loginId);
    }

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const otpRecord = await this.otpRepository.verify({
      email: user.email,
      phone: user.phone,
      code: input.otp,
      purpose: 'password_reset',
    });

    if (!otpRecord) {
      throw new AppError(400, 'Invalid or expired OTP');
    }

    const passwordHash = await bcrypt.hash(input.newPassword, 12);
    await this.userRepository.updatePassword(user._id.toString(), passwordHash);

    await this.otpRepository.deleteByEmail(user.email, 'password_reset');
    await this.otpRepository.deleteByPhone(user.phone, 'password_reset');

    return { message: 'Password reset successfully' };
  }

  /**
   * Register with full details (backward compatibility)
   */
  async register(input: {
    desiredLoginId: string;
    mobileNumber: string;
    fullName: string;
    address: string;
    country: string;
    state: string;
    district: string;
    pinCode: string;
    email: string;
    password: string;
    confirmPassword: string;
    role?: 'citizen' | 'officer' | 'admin';
  }) {
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await this.userRepository.create({
      desiredLoginId: input.desiredLoginId,
      mobileNumber: input.mobileNumber,
      fullName: input.fullName,
      address: input.address,
      country: input.country,
      state: input.state,
      district: input.district,
      pinCode: input.pinCode,
      email: input.email.toLowerCase(),
      phone: input.mobileNumber,
      passwordHash,
      role: input.role || 'citizen',
      otpVerified: true,
    });

    const token = signAccessToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    return { user, token };
  }
}

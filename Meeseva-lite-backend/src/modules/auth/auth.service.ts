import bcrypt from 'bcryptjs';
import { AppError } from '../../common/errors/app-error.js';
import { signAccessToken } from '../../common/utils/jwt.js';
import { env } from '../../config/env.js';
import { UserRepository } from '../users/user.repository.js';
import { OTPRepository } from './otp.repository.js';
import { OtpDeliveryService } from './otp-delivery.service.js';

export class AuthService {
  constructor(
    private readonly userRepository = new UserRepository(),
    private readonly otpRepository = new OTPRepository(),
    private readonly otpDeliveryService = new OtpDeliveryService()
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
    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new AppError(409, 'Email already registered');
    }

    const existingPhone = await this.userRepository.findByPhone(input.phone);
    if (existingPhone) {
      throw new AppError(409, 'Phone number already registered');
    }

    // Generate and send OTP
    const otp = this.generateOTP();
    await this.otpRepository.create({
      email: input.email,
      phone: input.phone,
      code: otp,
      purpose: 'registration',
    });

    await this.otpDeliveryService.sendOtp({
      phone: input.phone,
      email: input.email,
      otp,
      purpose: 'registration',
    });

    return {
      message: 'OTP sent successfully',
      phone: input.phone,
      expiresIn: 600, // 10 minutes
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
  }) {
    // Verify OTP
    const otpRecord = await this.otpRepository.verify({
      email: input.email,
      phone: input.phone,
      code: input.otp,
      purpose: 'registration',
    });

    if (!otpRecord) {
      throw new AppError(400, 'Invalid or expired OTP');
    }

    // Create user
    const passwordHash = await bcrypt.hash(input.password, 12);
    const user = await this.userRepository.create({
      fullName: input.fullName,
      email: input.email,
      phone: input.phone,
      passwordHash,
      role: 'citizen',
      otpVerified: true,
    });

    // Clean up OTP
    await this.otpRepository.deleteByEmail(input.email, 'registration');
    await this.otpRepository.deleteByPhone(input.phone, 'registration');

    // Generate token
    const token = signAccessToken({ userId: user._id.toString(), email: user.email, role: user.role });

    return { user, token };
  }

  /**
   * Login with email/phone and password
   */
  async login(input: { loginId: string; password: string }) {
    // Find user by email or phone
    let user = await this.userRepository.findByEmail(input.loginId);
    if (!user) {
      user = await this.userRepository.findByPhone(input.loginId);
    }

    if (!user) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError(401, 'Invalid credentials');
    }

    // Generate token
    const token = signAccessToken({ userId: user._id.toString(), email: user.email, role: user.role });

    return { user, token };
  }

  /**
   * Initiate forgot password - Send OTP
   */
  async initiateForgotPassword(input: { loginId: string }) {
    // Find user by email or phone
    let user = await this.userRepository.findByEmail(input.loginId);
    let phone = user?.phone;

    if (!user) {
      user = await this.userRepository.findByPhone(input.loginId);
      phone = input.loginId;
    }

    if (!user || !phone) {
      throw new AppError(404, 'User not found');
    }

    // Generate and send OTP
    const otp = this.generateOTP();
    await this.otpRepository.create({
      email: user.email,
      phone: phone,
      code: otp,
      purpose: 'password_reset',
    });

    await this.otpDeliveryService.sendOtp({
      phone,
      email: user.email,
      otp,
      purpose: 'password_reset',
    });

    return {
      message: 'OTP sent successfully',
      phone: phone,
      expiresIn: 600, // 10 minutes
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
    // Find user
    let user = await this.userRepository.findByEmail(input.loginId);
    if (!user) {
      user = await this.userRepository.findByPhone(input.loginId);
    }

    if (!user) {
      throw new AppError(404, 'User not found');
    }

    // Verify OTP
    const otpRecord = await this.otpRepository.verify({
      email: user.email,
      phone: user.phone,
      code: input.otp,
      purpose: 'password_reset',
    });

    if (!otpRecord) {
      throw new AppError(400, 'Invalid or expired OTP');
    }

    // Update password
    const passwordHash = await bcrypt.hash(input.newPassword, 12);
    await this.userRepository.updatePassword(user._id.toString(), passwordHash);

    // Clean up OTP
    await this.otpRepository.deleteByEmail(user.email, 'password_reset');
    await this.otpRepository.deleteByPhone(user.phone, 'password_reset');

    return { message: 'Password reset successfully' };
  }

  /**
   * Register with full details (old flow - backward compatibility)
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
      email: input.email,
      phone: input.mobileNumber,
      passwordHash,
      role: 'citizen',
      otpVerified: true,
    });

    const token = signAccessToken({ userId: user._id.toString(), email: user.email, role: user.role });

    return { user, token };
  }
}

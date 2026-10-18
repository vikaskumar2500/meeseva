export type UserRole = 'citizen' | 'officer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isVerified?: boolean;
  department?: string;
  badgeNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface RegisterDto {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export interface VerifyRegistrationOtpDto {
  phone: string;
  otp: string;
}

export interface LoginDto {
  email?: string;
  phone?: string;
  password?: string;
  otp?: string;
}

export interface ForgotPasswordDto {
  phone: string;
}

export interface ResetPasswordDto {
  phone: string;
  otp: string;
  newPassword: string;
}


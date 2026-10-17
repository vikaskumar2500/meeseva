import { z } from 'zod';

// Registration with OTP flow
export const initiateRegisterSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().regex(/^[0-9]{10}$/, 'Phone must be 10 digits'),
  }),
});

// Verify OTP for registration
export const verifyRegisterOtpSchema = z.object({
  body: z.object({
    email: z.string().email(),
    phone: z.string(),
    otp: z.string().length(6, 'OTP must be 6 digits'),
    fullName: z.string(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

// Login
export const loginSchema = z.object({
  body: z.object({
    loginId: z.string().min(1, 'Email or phone is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

// Forgot password - send OTP
export const initiateForgotPasswordSchema = z.object({
  body: z.object({
    loginId: z.string().min(1, 'Email or phone is required'),
  }),
});

// Verify forgot password OTP
export const verifyForgotPasswordSchema = z.object({
  body: z.object({
    loginId: z.string().min(1),
    otp: z.string().length(6, 'OTP must be 6 digits'),
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  }),
});

// Register (old schema - for backward compatibility)
export const registerSchema = z.object({
  body: z
    .object({
      desiredLoginId: z.string().min(1),
      mobileNumber: z.string().min(1),
      fullName: z.string().min(1),
      address: z.string().min(1),
      country: z.string().min(1),
      state: z.string().min(1),
      district: z.string().min(1),
      pinCode: z.string().min(1),
      email: z.string().email(),
      password: z.string().min(8),
      confirmPassword: z.string().min(8),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

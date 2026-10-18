import { z } from 'zod';

export const phoneSchema = z
  .string()
  .trim()
  .regex(/^[6-9]\d{9}$/, 'Must be a valid 10-digit Indian mobile number');

export const emailSchema = z
  .string()
  .trim()
  .email('Invalid email address')
  .toLowerCase();

export const otpSchema = z
  .string()
  .trim()
  .length(6, 'OTP must be exactly 6 digits')
  .regex(/^\d{6}$/, 'OTP must contain numbers only');

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  phone: phoneSchema,
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
});

export const loginSchema = z.object({
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  password: z.string().min(1, 'Password is required').optional(),
  otp: otpSchema.optional(),
});

export const verifyOtpSchema = z.object({
  phone: phoneSchema,
  otp: otpSchema,
});

export const createApplicationSchema = z.object({
  serviceId: z.number().int().positive('Service ID is required'),
  formData: z.record(z.any()),
  documents: z
    .array(
      z.object({
        name: z.string(),
        url: z.string().url('Must be a valid document URL'),
      })
    )
    .optional(),
});

export const updateApplicationStatusSchema = z.object({
  status: z.enum([
    'submitted',
    'under_review',
    'document_verification',
    'field_verification',
    'approved',
    'rejected',
  ]),
  remarks: z.string().optional(),
});


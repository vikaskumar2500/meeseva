import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

if (process.env.NODE_ENV === 'test') {
  process.env.MONGODB_URI ??= 'mongodb://127.0.0.1:27017/ise_backend_test';
  process.env.JWT_SECRET ??= 'test-secret-key-for-vitest-123456';
  process.env.JWT_EXPIRES_IN ??= '1d';
}

const optionalString = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().optional()
);
const optionalEmail = z.preprocess(
  (value) => (value === '' ? undefined : value),
  z.string().email().optional()
);

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(5001),
  MONGODB_URI: z.string().min(1),
  MONGODB_USER: optionalString,
  MONGODB_PASS: optionalString,
  MONGODB_AUTH_SOURCE: optionalString,
  JWT_SECRET: z.string().min(16),
  JWT_EXPIRES_IN: z.string().default('1d'),
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  UPLOAD_DIR: z.string().default('uploads'),
  MAX_UPLOAD_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .default(5 * 1024 * 1024),
  MAX_AUDIO_BYTES: z.coerce
    .number()
    .int()
    .positive()
    .default(4 * 1024 * 1024),
  GOOGLE_APPLICATION_CREDENTIALS: optionalString,
  GOOGLE_SPEECH_LANGUAGE: z.string().default('en-IN'),
  TWILIO_ACCOUNT_SID: optionalString,
  TWILIO_AUTH_TOKEN: optionalString,
  TWILIO_FROM_PHONE: optionalString,
  SENDGRID_API_KEY: optionalString,
  OTP_EMAIL_FROM: optionalEmail,
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(`Invalid environment variables: ${parsed.error.message}`);
}

export const env = parsed.data;

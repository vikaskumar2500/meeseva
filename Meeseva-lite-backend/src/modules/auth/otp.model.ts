import { Schema, model, type HydratedDocument } from 'mongoose';

export interface OTP {
  email?: string;
  phone?: string;
  code: string;
  purpose: 'registration' | 'password_reset';
  expiresAt: Date;
  attempts: number;
  verified: boolean;
}

export type OTPDocument = HydratedDocument<OTP>;

const otpSchema = new Schema<OTP>(
  {
    email: { type: String, lowercase: true },
    phone: { type: String },
    code: { type: String, required: true },
    purpose: {
      type: String,
      enum: ['registration', 'password_reset'],
      required: true,
    },
    expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
    attempts: { type: Number, default: 0 },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const OTPModel = model<OTP>('OTP', otpSchema);

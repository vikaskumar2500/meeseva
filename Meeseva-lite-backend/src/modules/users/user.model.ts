import { Schema, model, type HydratedDocument } from 'mongoose';

export type UserRole = 'citizen' | 'admin';

export interface User {
  desiredLoginId?: string;
  mobileNumber?: string;
  fullName: string;
  address?: string;
  country?: string;
  state?: string;
  district?: string;
  pinCode?: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  aadhaar?: string;
  avatar?: string;
  otpVerified: boolean;
  savedServices?: number[];
  uploadedDocuments?: string[];
  trustedDocuments?: {
    name: string;
    issuer: string;
    verified: boolean;
  }[];
  applicationHistory?: {
    totalApplications: number;
    totalApproved: number;
    totalRejected: number;
    totalPending: number;
  };
}

export type UserDocument = HydratedDocument<User>;

const userSchema = new Schema<User>(
  {
    desiredLoginId: { type: String, unique: true, sparse: true, trim: true },
    mobileNumber: { type: String, unique: true, sparse: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    address: { type: String, trim: true },
    country: { type: String, trim: true },
    state: { type: String, trim: true },
    district: { type: String, trim: true },
    pinCode: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' },
    aadhaar: { type: String },
    avatar: { type: String },
    otpVerified: { type: Boolean, default: false },
    savedServices: { type: [Number], default: [] },
    uploadedDocuments: { type: [String], default: [] },
    trustedDocuments: [
      {
        name: String,
        issuer: String,
        verified: { type: Boolean, default: false },
      }
    ],
    applicationHistory: {
      totalApplications: { type: Number, default: 0 },
      totalApproved: { type: Number, default: 0 },
      totalRejected: { type: Number, default: 0 },
      totalPending: { type: Number, default: 0 },
    },
  },
  { timestamps: true },
);

userSchema.set('toJSON', {
  transform: (_document, returnedObject) => {
    const { passwordHash: _passwordHash, ...safeObject } = returnedObject as unknown as { passwordHash?: string } & Record<string, unknown>;
    return safeObject;
  },
});

export const UserModel = model<User>('User', userSchema);
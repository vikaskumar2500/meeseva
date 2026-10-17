import { Schema, model, type HydratedDocument, type Types } from 'mongoose';

export type DocumentType =
  | 'aadhaar'
  | 'pan'
  | 'passport'
  | 'license'
  | 'certificate'
  | 'other';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface Document {
  userId: Types.ObjectId;
  name: string;
  type: DocumentType;
  issuer: string;
  issueDate?: Date;
  expiryDate?: Date;
  documentNumber: string;
  fileUrl: string;
  fileMimetype: string;
  fileSize: number;
  verificationStatus: VerificationStatus;
  extractedData?: Record<string, unknown>;
  remarks?: string;
}

export type DocumentDocument = HydratedDocument<Document>;

const documentSchema = new Schema<Document>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: ['aadhaar', 'pan', 'passport', 'license', 'certificate', 'other'],
      required: true,
    },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: Date },
    expiryDate: { type: Date },
    documentNumber: { type: String, required: true, trim: true, index: true },
    fileUrl: { type: String, required: true },
    fileMimetype: { type: String, required: true },
    fileSize: { type: Number, required: true },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
      index: true,
    },
    extractedData: { type: Schema.Types.Mixed, default: {} },
    remarks: { type: String },
  },
  { timestamps: true }
);

export const DocumentModel = model<Document>('Document', documentSchema);

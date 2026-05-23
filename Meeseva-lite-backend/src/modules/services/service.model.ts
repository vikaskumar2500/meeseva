import { Schema, model, type HydratedDocument } from 'mongoose';

export interface Service {
  id: number;
  name: string;
  description: string;
  category: string;
  department: string;
  eligibility: string[];
  requiredDocuments: string[];
  fees: number;
  processingTime: string;
  applicationUrl?: string;
  phoneNumber?: string;
  email?: string;
  address?: string;
  icon?: string;
  rating?: number;
  reviewCount?: number;
  popular?: boolean;
  tags?: string[];
  steps?: string[];
}

export type ServiceDocument = HydratedDocument<Service>;

const serviceSchema = new Schema<Service>(
  {
    id: { type: Number, unique: true, required: true, index: true },
    name: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    department: { type: String, required: true, index: true },
    eligibility: { type: [String], default: [] },
    requiredDocuments: { type: [String], default: [] },
    fees: { type: Number, default: 0 },
    processingTime: { type: String, default: 'Not specified' },
    applicationUrl: { type: String },
    phoneNumber: { type: String },
    email: { type: String },
    address: { type: String },
    icon: { type: String },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    reviewCount: { type: Number, default: 0 },
    popular: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    steps: { type: [String], default: [] },
  },
  { timestamps: true }
);

export const ServiceModel = model<Service>('Service', serviceSchema);

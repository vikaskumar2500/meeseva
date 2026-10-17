export type UserRole = 'citizen' | 'officer' | 'admin';

export interface User {
  id: string;
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  role: UserRole;
  otpVerified: boolean;
  aadhaar?: string;
  avatar?: string;
  savedServices?: number[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface GovService {
  _id?: string;
  id: number;
  name: string;
  description: string;
  category: string;
  department: string;
  eligibility: string[];
  requiredDocuments: string[];
  fees: number;
  processingTime: string;
  rating: number;
  reviewCount: number;
  popular: boolean;
  tags: string[];
}

export type ApplicationStatus = 'draft' | 'submitted' | 'in_review' | 'approved' | 'rejected';

export interface Application {
  _id: string;
  id?: string;
  userId: string;
  applicationType: string;
  title: string;
  status: ApplicationStatus;
  payload: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingEntry {
  _id: string;
  applicationId: string;
  status: ApplicationStatus | string;
  note?: string;
  updatedBy: string;
  createdAt: string;
}

export interface PublicTrackingResult {
  application: {
    id: string;
    title: string;
    applicationType: string;
    status: ApplicationStatus;
    createdAt: string;
    updatedAt: string;
  };
  timeline: TrackingEntry[];
}

export type DocumentType = 'aadhaar' | 'pan' | 'passport' | 'license' | 'certificate' | 'other';
export type VerificationStatus = 'pending' | 'verified' | 'rejected';

export interface UserDocument {
  _id: string;
  id?: string;
  userId: string;
  name: string;
  type: DocumentType;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  documentNumber: string;
  fileUrl: string;
  fileMimetype: string;
  fileSize: number;
  verificationStatus: VerificationStatus;
  remarks?: string;
  createdAt: string;
}


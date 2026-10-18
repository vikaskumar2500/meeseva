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
  createdAt?: string;
  updatedAt?: string;
}

export interface ServiceFilterQuery {
  page?: number;
  limit?: number;
  category?: string;
  department?: string;
  tag?: string;
  search?: string;
}


export type ApplicationStatus =
  | 'submitted'
  | 'under_review'
  | 'document_verification'
  | 'field_verification'
  | 'approved'
  | 'rejected';

export interface TrackingTimelineEvent {
  status: ApplicationStatus;
  timestamp: string;
  note: string;
  actor?: string;
}

export interface ApplicationDocument {
  name: string;
  url: string;
  verified?: boolean;
}

export interface Application {
  id: string;
  _id?: string;
  applicationId: string;
  userId: string;
  serviceId: number;
  serviceName: string;
  status: ApplicationStatus;
  formData: Record<string, any>;
  documents: ApplicationDocument[];
  remarks?: string;
  assignedOfficerId?: string;
  timeline: TrackingTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateApplicationDto {
  serviceId: number;
  formData: Record<string, any>;
  documents?: ApplicationDocument[];
}

export interface UpdateApplicationStatusDto {
  status: ApplicationStatus;
  remarks?: string;
  officerNote?: string;
}


import type { ApplicationStatus, DocumentCategory, UserRole } from '../types/index.js';

export const USER_ROLES: Record<string, UserRole> = {
  CITIZEN: 'citizen',
  OFFICER: 'officer',
  ADMIN: 'admin',
} as const;

export const APPLICATION_STATUS_LIST: ApplicationStatus[] = [
  'submitted',
  'under_review',
  'document_verification',
  'field_verification',
  'approved',
  'rejected',
];

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  submitted: 'Submitted & Acknowledged',
  under_review: 'Under Scrutiny',
  document_verification: 'Document Verification',
  field_verification: 'Field Verification',
  approved: 'Approved & Certificate Issued',
  rejected: 'Rejected / Clarification Needed',
};

export const DOCUMENT_CATEGORIES: DocumentCategory[] = [
  'identity',
  'income',
  'caste',
  'residence',
  'education',
  'other',
];

export const GOV_SERVICE_CATEGORIES = [
  'Certificates & Revenue',
  'Social Welfare & Pensions',
  'Food & Civil Supplies',
  'Land & Agriculture',
  'Transport & Vehicles',
  'Civic & Municipal Services',
  'Utilities & Infrastructure',
  'Business & Commercial',
] as const;

export const SUPPORTED_LOCALES = [
  { code: 'te-IN', name: 'తెలుగు (Telugu)' },
  { code: 'hi-IN', name: 'हिन्दी (Hindi)' },
  { code: 'en-IN', name: 'English (Indian)' },
  { code: 'ta-IN', name: 'தமிழ் (Tamil)' },
] as const;


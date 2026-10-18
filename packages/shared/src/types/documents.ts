export type DocumentCategory =
  | 'identity'
  | 'income'
  | 'caste'
  | 'residence'
  | 'education'
  | 'other';

export interface CitizenDocument {
  id: string;
  _id?: string;
  userId: string;
  title: string;
  category: DocumentCategory;
  fileUrl: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  verified: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UploadDocumentDto {
  title: string;
  category: DocumentCategory;
  notes?: string;
}

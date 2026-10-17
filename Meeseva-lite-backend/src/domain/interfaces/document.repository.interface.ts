import type {
  Document,
  DocumentType,
} from '../../modules/documents/document.model.js';

export interface IDocumentRepository {
  create(userId: string, data: Omit<Document, 'userId'>): Promise<any>;
  findById(id: string): Promise<any>;
  findByUserId(userId: string, skip?: number, limit?: number): Promise<any[]>;
  findByUserIdAndType(userId: string, type: DocumentType): Promise<any>;
  findVerified(userId: string): Promise<any[]>;
  findPending(userId: string): Promise<any[]>;
  countByUserId(userId: string): Promise<number>;
  updateVerificationStatus(
    id: string,
    status: 'pending' | 'verified' | 'rejected',
    remarks?: string
  ): Promise<any>;
  updateExtractedData(id: string, data: Record<string, unknown>): Promise<any>;
  delete(id: string): Promise<any>;
  deleteByUserId(userId: string): Promise<any>;
}

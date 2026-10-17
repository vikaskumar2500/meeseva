import { DocumentModel } from './document.model.js';
import type { Document, DocumentType } from './document.model.js';
import type { IDocumentRepository } from '../../domain/interfaces/document.repository.interface.js';

export class DocumentRepository implements IDocumentRepository {
  async create(userId: string, data: Omit<Document, 'userId'>) {
    return DocumentModel.create({ ...data, userId });
  }

  async findById(id: string) {
    return DocumentModel.findById(id).lean();
  }

  async findByUserId(userId: string, skip: number = 0, limit: number = 10) {
    return DocumentModel.find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean();
  }

  async findByUserIdAndType(userId: string, type: DocumentType) {
    return DocumentModel.findOne({ userId, type }).lean();
  }

  async findVerified(userId: string) {
    return DocumentModel.find({ userId, verificationStatus: 'verified' })
      .sort({ updatedAt: -1 })
      .lean();
  }

  async findPending(userId: string) {
    return DocumentModel.find({ userId, verificationStatus: 'pending' })
      .sort({ createdAt: -1 })
      .lean();
  }

  async countByUserId(userId: string) {
    return DocumentModel.countDocuments({ userId });
  }

  async updateVerificationStatus(
    id: string,
    status: 'pending' | 'verified' | 'rejected',
    remarks?: string
  ) {
    return DocumentModel.findByIdAndUpdate(
      id,
      { verificationStatus: status, remarks },
      { returnDocument: 'after' }
    ).lean();
  }

  async updateExtractedData(id: string, data: Record<string, unknown>) {
    return DocumentModel.findByIdAndUpdate(
      id,
      { extractedData: data },
      { returnDocument: 'after' }
    ).lean();
  }

  async delete(id: string) {
    return DocumentModel.findByIdAndDelete(id);
  }

  async deleteByUserId(userId: string) {
    return DocumentModel.deleteMany({ userId });
  }
}

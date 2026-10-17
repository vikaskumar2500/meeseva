import { AppError } from '../../common/errors/app-error.js';
import type { IDocumentRepository } from '../../domain/interfaces/document.repository.interface.js';
import type {
  IStorageProvider,
  FileUploadPayload,
} from '../../domain/interfaces/storage.provider.interface.js';
import type { DocumentType } from './document.model.js';
import { DocumentRepository } from './document.repository.js';
import { LocalStorageProvider } from '../../infrastructure/storage/local-storage.provider.js';

export interface UploadDocumentDto {
  name: string;
  type: DocumentType;
  issuer?: string;
  issueDate?: string;
  expiryDate?: string;
  documentNumber?: string;
}

export class DocumentService {
  constructor(
    private readonly documentRepository: IDocumentRepository = new DocumentRepository(),
    private readonly storageProvider: IStorageProvider = new LocalStorageProvider()
  ) {}

  async uploadDocument(
    userId: string,
    file: FileUploadPayload,
    dto: UploadDocumentDto
  ) {
    const stored = await this.storageProvider.saveFile(file);

    return this.documentRepository.create(userId, {
      name: dto.name,
      type: dto.type,
      issuer: dto.issuer || 'Government Authority / Self',
      issueDate: dto.issueDate ? new Date(dto.issueDate) : undefined,
      expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
      documentNumber: dto.documentNumber || `DOC-${Date.now()}`,
      fileUrl: stored.url,
      fileMimetype: stored.mimetype,
      fileSize: stored.size,
      verificationStatus: 'pending',
    });
  }

  async getUserDocuments(
    userId: string,
    page = 1,
    limit = 10,
    status?: string
  ) {
    const skip = (page - 1) * limit;

    let documents;
    if (status === 'verified') {
      documents = await this.documentRepository.findVerified(userId);
    } else if (status === 'pending') {
      documents = await this.documentRepository.findPending(userId);
    } else {
      documents = await this.documentRepository.findByUserId(
        userId,
        skip,
        limit
      );
    }

    const total = await this.documentRepository.countByUserId(userId);

    return {
      data: documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async getDocumentById(userId: string, documentId: string) {
    const document = await this.documentRepository.findById(documentId);
    if (!document) {
      throw new AppError(404, 'Document not found');
    }

    if (document.userId.toString() !== userId) {
      throw new AppError(403, 'Access denied: not document owner');
    }

    return document;
  }

  async updateVerificationStatus(
    documentId: string,
    status: 'pending' | 'verified' | 'rejected',
    remarks?: string
  ) {
    const document = await this.documentRepository.findById(documentId);
    if (!document) {
      throw new AppError(404, 'Document not found');
    }

    return this.documentRepository.updateVerificationStatus(
      documentId,
      status,
      remarks
    );
  }

  async verifyDocument(
    documentId: string,
    status: 'pending' | 'verified' | 'rejected',
    remarks?: string
  ) {
    return this.updateVerificationStatus(documentId, status, remarks);
  }

  async updateExtractedData(
    userId: string,
    documentId: string,
    data: Record<string, unknown>
  ) {
    await this.getDocumentById(userId, documentId);
    return this.documentRepository.updateExtractedData(documentId, data);
  }

  async deleteDocument(userId: string, documentId: string) {
    const document = await this.getDocumentById(userId, documentId);
    if (document.fileUrl) {
      await this.storageProvider.deleteFile(document.fileUrl);
    }
    return this.documentRepository.delete(documentId);
  }
}

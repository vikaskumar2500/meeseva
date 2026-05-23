import type { RequestHandler } from 'express';
import { DocumentRepository } from './document.repository.js';
import { AppError } from '../../common/errors/app-error.js';

export class DocumentController {
  constructor(private readonly repository = new DocumentRepository()) {}

  /**
   * Upload a document
   */
  uploadDocument: RequestHandler = async (request, response, next) => {
    try {
      if (!request.user) {
        throw new AppError(401, 'Unauthorized');
      }

      if (!request.file) {
        throw new AppError(400, 'No file uploaded');
      }

      const { name, type, issuer, issueDate, expiryDate, documentNumber } = request.body;

      // Mock file storage - in production use S3, GCS, or similar
      const fileUrl = `/uploads/${request.file.filename}`;

      const document = await this.repository.create(request.user.id, {
        name,
        type,
        issuer,
        issueDate: issueDate ? new Date(issueDate) : undefined,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        documentNumber,
        fileUrl,
        fileMimetype: request.file.mimetype,
        fileSize: request.file.size,
        verificationStatus: 'pending',
      });

      response.status(201).json(document);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get user's documents
   */
  getDocuments: RequestHandler = async (request, response, next) => {
    try {
      if (!request.user) {
        throw new AppError(401, 'Unauthorized');
      }

      const page = Math.max(1, parseInt(request.query.page as string) || 1);
      const limit = Math.max(1, Math.min(100, parseInt(request.query.limit as string) || 10));
      const skip = (page - 1) * limit;

      let documents;
      const status = request.query.status as string;

      if (status === 'verified') {
        documents = await this.repository.findVerified(request.user.id);
      } else if (status === 'pending') {
        documents = await this.repository.findPending(request.user.id);
      } else {
        documents = await this.repository.findByUserId(request.user.id, skip, limit);
      }

      const total = await this.repository.countByUserId(request.user.id);

      response.json({
        data: documents,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get single document
   */
  getDocument: RequestHandler = async (request, response, next) => {
    try {
      if (!request.user) {
        throw new AppError(401, 'Unauthorized');
      }

      const documentId = String(request.params.id);
      const document = await this.repository.findById(documentId);

      if (!document) {
        throw new AppError(404, 'Document not found');
      }

      // Check ownership
      if (document.userId.toString() !== request.user.id) {
        throw new AppError(403, 'Forbidden');
      }

      response.json(document);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Delete document
   */
  deleteDocument: RequestHandler = async (request, response, next) => {
    try {
      if (!request.user) {
        throw new AppError(401, 'Unauthorized');
      }

      const documentId = String(request.params.id);
      const document = await this.repository.findById(documentId);

      if (!document) {
        throw new AppError(404, 'Document not found');
      }

      // Check ownership
      if (document.userId.toString() !== request.user.id) {
        throw new AppError(403, 'Forbidden');
      }

      await this.repository.delete(documentId);

      response.json({ message: 'Document deleted successfully' });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update document verification status (Admin only)
   */
  updateVerificationStatus: RequestHandler = async (request, response, next) => {
    try {
      const { status, remarks } = request.body;
      const documentId = String(request.params.id);

      const document = await this.repository.findById(documentId);

      if (!document) {
        throw new AppError(404, 'Document not found');
      }

      const updated = await this.repository.updateVerificationStatus(
        documentId,
        status,
        remarks
      );

      response.json(updated);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update extracted data (from OCR)
   */
  updateExtractedData: RequestHandler = async (request, response, next) => {
    try {
      if (!request.user) {
        throw new AppError(401, 'Unauthorized');
      }

      const documentId = String(request.params.id);
      const document = await this.repository.findById(documentId);

      if (!document) {
        throw new AppError(404, 'Document not found');
      }

      // Check ownership
      if (document.userId.toString() !== request.user.id) {
        throw new AppError(403, 'Forbidden');
      }

      const updated = await this.repository.updateExtractedData(
        documentId,
        request.body.extractedData
      );

      response.json(updated);
    } catch (error) {
      next(error);
    }
  };
}

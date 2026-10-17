import type { RequestHandler } from 'express';
import { AppError } from '../../common/errors/app-error.js';
import { DocumentService } from './document.service.js';

export class DocumentController {
  constructor(private readonly service = new DocumentService()) {}

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

      const { name, type, issuer, issueDate, expiryDate, documentNumber } =
        request.body;

      const document = await this.service.uploadDocument(
        request.user.id,
        {
          filename: request.file.filename,
          originalname: request.file.originalname,
          mimetype: request.file.mimetype,
          size: request.file.size,
          path: request.file.path,
        },
        {
          name,
          type,
          issuer,
          issueDate,
          expiryDate,
          documentNumber,
        }
      );

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
      const limit = Math.max(
        1,
        Math.min(100, parseInt(request.query.limit as string) || 10)
      );
      const status = request.query.status as string;

      const result = await this.service.getUserDocuments(
        request.user.id,
        page,
        limit,
        status
      );
      response.json(result);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get document by ID
   */
  getDocumentById: RequestHandler = async (request, response, next) => {
    try {
      if (!request.user) {
        throw new AppError(401, 'Unauthorized');
      }

      const id = Array.isArray(request.params.id)
        ? request.params.id[0]
        : request.params.id;
      const document = await this.service.getDocumentById(request.user.id, id);
      response.json(document);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Alias for getDocumentById
   */
  getDocument: RequestHandler = (request, response, next) => {
    return this.getDocumentById(request, response, next);
  };

  /**
   * Get verified documents
   */
  getVerifiedDocuments: RequestHandler = async (request, response, next) => {
    try {
      if (!request.user) {
        throw new AppError(401, 'Unauthorized');
      }

      const result = await this.service.getUserDocuments(
        request.user.id,
        1,
        100,
        'verified'
      );
      response.json({ data: result.data });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Get pending documents
   */
  getPendingDocuments: RequestHandler = async (request, response, next) => {
    try {
      if (!request.user) {
        throw new AppError(401, 'Unauthorized');
      }

      const result = await this.service.getUserDocuments(
        request.user.id,
        1,
        100,
        'pending'
      );
      response.json({ data: result.data });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update extracted data
   */
  updateExtractedData: RequestHandler = async (request, response, next) => {
    try {
      if (!request.user) {
        throw new AppError(401, 'Unauthorized');
      }

      const id = Array.isArray(request.params.id)
        ? request.params.id[0]
        : request.params.id;
      const document = await this.service.updateExtractedData(
        request.user.id,
        id,
        request.body.extractedData || request.body
      );
      response.json(document);
    } catch (error) {
      next(error);
    }
  };

  /**
   * Update document verification status (Officer/Admin action)
   */
  updateVerificationStatus: RequestHandler = async (
    request,
    response,
    next
  ) => {
    try {
      const { status, remarks } = request.body;
      const id = Array.isArray(request.params.id)
        ? request.params.id[0]
        : request.params.id;
      const document = await this.service.verifyDocument(id, status, remarks);
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

      const id = Array.isArray(request.params.id)
        ? request.params.id[0]
        : request.params.id;
      await this.service.deleteDocument(request.user.id, id);
      response.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}

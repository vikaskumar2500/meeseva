import { Router } from 'express';
import { requireAuth } from '../../common/middlewares/auth.js';
import { uploadSingleDocument } from '../../common/middlewares/upload.js';
import { DocumentController } from './document.controller.js';

const router = Router();
const documentController = new DocumentController();

// All document routes require authentication
router.use(requireAuth);

// Upload document
router.post('/', uploadSingleDocument, documentController.uploadDocument);

// Get all documents for user
router.get('/', documentController.getDocuments);

// Get single document
router.get('/:id', documentController.getDocument);

// Delete document
router.delete('/:id', documentController.deleteDocument);

// Update extracted data
router.patch('/:id/extracted-data', documentController.updateExtractedData);

// Update verification status (Admin)
router.patch('/:id/verification', documentController.updateVerificationStatus);

export { router as documentRoutes };

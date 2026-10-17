import { Router } from 'express';
import { ServiceController } from './service.controller.js';
import { validate } from '../../common/middlewares/validate.js';
import {
  getServicesSchema,
  searchServicesSchema,
  getPopularServicesSchema,
  getServiceByIdSchema,
} from './service.validation.js';

const router = Router();
const serviceController = new ServiceController();

// Get all services with filtering
router.get('/', validate(getServicesSchema), serviceController.getAllServices);

// Search services
router.get('/search', validate(searchServicesSchema), serviceController.searchServices);

// Get popular services
router.get('/popular', validate(getPopularServicesSchema), serviceController.getPopularServices);

// Direct filter metadata routes
router.get('/categories', serviceController.getCategories);
router.get('/departments', serviceController.getDepartments);
router.get('/tags', serviceController.getTags);

// Backward-compatible nested filter metadata routes
router.get('/filters/categories', serviceController.getCategories);
router.get('/filters/departments', serviceController.getDepartments);
router.get('/filters/tags', serviceController.getTags);

// Get service by ID (validated numeric ID)
router.get('/:id', validate(getServiceByIdSchema), serviceController.getServiceById);

export { router as serviceRoutes };

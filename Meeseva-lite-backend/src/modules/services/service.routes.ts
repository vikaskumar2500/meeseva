import { Router } from 'express';
import { ServiceController } from './service.controller.js';

const router = Router();
const serviceController = new ServiceController();

// Get all services with filtering
router.get('/', serviceController.getAllServices);

// Search services
router.get('/search', serviceController.searchServices);

// Get popular services
router.get('/popular', serviceController.getPopularServices);

// Get all categories
router.get('/filters/categories', serviceController.getCategories);

// Get all departments
router.get('/filters/departments', serviceController.getDepartments);

// Get all tags
router.get('/filters/tags', serviceController.getTags);

// Get service by ID (must be last due to param matching)
router.get('/:id', serviceController.getServiceById);

export { router as serviceRoutes };

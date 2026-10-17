import { Router } from 'express';
import { requireAuth, requireRoles } from '../../common/middlewares/auth.js';
import { validate } from '../../common/middlewares/validate.js';
import { ApplicationController } from './application.controller.js';
import {
  applicationIdSchema,
  createApplicationSchema,
  updateApplicationSchema,
} from './application.validation.js';

const router = Router();
const applicationController = new ApplicationController();

router.use(requireAuth);

// Officer/Admin overview route
router.get(
  '/all',
  requireRoles(['admin', 'officer']),
  applicationController.listAll
);

// Standard citizen & officer routes
router.post(
  '/',
  validate(createApplicationSchema),
  applicationController.create
);
router.get('/', applicationController.list);
router.get(
  '/:applicationId',
  validate(applicationIdSchema),
  applicationController.getById
);
router.patch(
  '/:applicationId',
  validate(updateApplicationSchema),
  applicationController.update
);
router.post(
  '/:applicationId/status',
  requireRoles(['admin', 'officer']),
  applicationController.updateStatus
);
router.delete(
  '/:applicationId',
  validate(applicationIdSchema),
  applicationController.delete
);

export { router as applicationRoutes };

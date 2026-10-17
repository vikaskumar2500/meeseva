import { Router } from 'express';
import { requireAuth } from '../../common/middlewares/auth.js';
import { validate } from '../../common/middlewares/validate.js';
import { TrackingController } from './tracking.controller.js';
import {
  applicationTrackingSchema,
  createTrackingSchema,
} from './tracking.validation.js';

const router = Router();
const trackingController = new TrackingController();

// Public tracking lookup
router.get(
  '/public/:applicationId',
  validate(applicationTrackingSchema),
  trackingController.publicTimeline
);

// Authenticated tracking
router.use(requireAuth);
router.post('/', validate(createTrackingSchema), trackingController.create);
router.get(
  '/:applicationId',
  validate(applicationTrackingSchema),
  trackingController.timeline
);

export { router as trackingRoutes };

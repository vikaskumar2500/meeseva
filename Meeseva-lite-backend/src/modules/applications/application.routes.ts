import { Router } from 'express';
import { requireAuth } from '../../common/middlewares/auth.js';
import { validate } from '../../common/middlewares/validate.js';
import { ApplicationController } from './application.controller.js';
import { applicationIdSchema, createApplicationSchema, updateApplicationSchema } from './application.validation.js';

const router = Router();
const applicationController = new ApplicationController();

router.use(requireAuth);
router.post('/', validate(createApplicationSchema), applicationController.create);
router.get('/', applicationController.list);
router.get('/:applicationId', validate(applicationIdSchema), applicationController.getById);
router.patch('/:applicationId', validate(updateApplicationSchema), applicationController.update);
router.delete('/:applicationId', validate(applicationIdSchema), applicationController.delete);

export { router as applicationRoutes };
import { Router } from 'express';
import { uploadSingleAudio } from '../../common/middlewares/upload-audio.js';
import { SpeechController } from './speech.controller.js';

const router = Router();
const speechController = new SpeechController();

router.post('/recognize', uploadSingleAudio, speechController.recognize);

export { router as speechRoutes };

import { createRequire } from 'node:module';
import type { RequestHandler } from 'express';
import { AppError } from '../errors/app-error.js';
import { env } from '../../config/env.js';

const require = createRequire(import.meta.url);
let uploadMiddleware: RequestHandler | undefined;

const allowedMimeTypes = new Set(['audio/wav', 'audio/x-wav', 'audio/wave']);

const loadMulter = () => {
  try {
    return require('multer') as any;
  } catch {
    throw new AppError(500, 'File upload dependency is missing. Run `pnpm add multer` and restart the server.');
  }
};

const getUploadMiddleware = (): RequestHandler => {
  if (uploadMiddleware) {
    return uploadMiddleware;
  }

  const multer = loadMulter();

  uploadMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: env.MAX_AUDIO_BYTES, files: 1 },
    fileFilter: (
      _request: unknown,
      file: { mimetype: string },
      callback: (error: Error | null, acceptFile?: boolean) => void,
    ) => {
      if (!allowedMimeTypes.has(file.mimetype)) {
        callback(new AppError(400, 'Only WAV audio files are allowed'));
        return;
      }

      callback(null, true);
    },
  }).single('file') as RequestHandler;

  return uploadMiddleware;
};

export const uploadSingleAudio: RequestHandler = (request, response, next) => {
  getUploadMiddleware()(request, response, (error: unknown) => {
    if (!error) {
      next();
      return;
    }

    const multerError = error as { code?: string; message?: string };
    if (multerError.code === 'LIMIT_FILE_SIZE') {
      next(new AppError(400, `Audio is too large. Maximum allowed size is ${env.MAX_AUDIO_BYTES} bytes`));
      return;
    }

    next(error);
  });
};

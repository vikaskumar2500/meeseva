import { randomUUID } from 'node:crypto';
import { existsSync, mkdirSync } from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import type { RequestHandler } from 'express';
import { AppError } from '../errors/app-error.js';
import { env } from '../../config/env.js';

const require = createRequire(import.meta.url);
let uploadMiddleware: RequestHandler | undefined;

const allowedMimeTypes = new Set(['image/jpeg', 'image/png', 'application/pdf']);

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
  const uploadRoot = path.resolve(process.cwd(), env.UPLOAD_DIR);

  if (!existsSync(uploadRoot)) {
    mkdirSync(uploadRoot, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: (_request: unknown, _file: unknown, callback: (error: Error | null, destination: string) => void) => {
      callback(null, uploadRoot);
    },
    filename: (_request: unknown, file: { originalname: string }, callback: (error: Error | null, filename: string) => void) => {
      const extension = path.extname(file.originalname).toLowerCase();
      callback(null, `${Date.now()}-${randomUUID()}${extension}`);
    },
  });

  uploadMiddleware = multer({
    storage,
    limits: { fileSize: env.MAX_UPLOAD_BYTES, files: 1 },
    fileFilter: (
      _request: unknown,
      file: { mimetype: string },
      callback: (error: Error | null, acceptFile?: boolean) => void,
    ) => {
      if (!allowedMimeTypes.has(file.mimetype)) {
        callback(new AppError(400, 'Only JPG, PNG, and PDF documents are allowed'));
        return;
      }

      callback(null, true);
    },
  }).single('file') as RequestHandler;

  return uploadMiddleware;
};

export const uploadSingleDocument: RequestHandler = (request, response, next) => {
  getUploadMiddleware()(request, response, (error: unknown) => {
    if (!error) {
      next();
      return;
    }

    const multerError = error as { code?: string; message?: string };
    if (multerError.code === 'LIMIT_FILE_SIZE') {
      next(new AppError(400, `File is too large. Maximum allowed size is ${env.MAX_UPLOAD_BYTES} bytes`));
      return;
    }

    next(error);
  });
};

import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'node:path';
import { errorHandler } from './common/middlewares/error-handler.js';
import { notFound } from './common/middlewares/not-found.js';
import { env } from './config/env.js';
import { authRoutes } from './modules/auth/auth.routes.js';
import { applicationRoutes } from './modules/applications/application.routes.js';
import { trackingRoutes } from './modules/tracking/tracking.routes.js';
import { userRoutes } from './modules/users/user.routes.js';
import { serviceRoutes } from './modules/services/service.routes.js';
import { documentRoutes } from './modules/documents/document.routes.js';
import { speechRoutes } from './modules/speech/speech.routes.js';

export const createApp = () => {
  const app = express();

  app.use(helmet());
  app.use(cors());
  app.use(express.json({ limit: '1mb' }));
  app.use('/uploads', express.static(path.resolve(process.cwd(), env.UPLOAD_DIR)));
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 200 }));

  app.get('/health', (_request, response) => {
    response.json({ status: 'ok' });
  });

  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/users', userRoutes);
  app.use('/api/v1/applications', applicationRoutes);
  app.use('/api/v1/tracking', trackingRoutes);
    app.use('/api/v1/services', serviceRoutes);
    app.use('/api/v1/documents', documentRoutes);
    app.use('/api/v1/speech', speechRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

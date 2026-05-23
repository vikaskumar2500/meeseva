import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/app-error.js';
import { env } from '../../config/env.js';
import { UserModel } from '../../modules/users/user.model.js';

type AuthTokenPayload = {
  sub: string;
  email: string;
  role: 'citizen' | 'admin';
};

export const requireAuth: RequestHandler = async (request, _response, next) => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith('Bearer ')) {
    next(new AppError(401, 'Unauthorized'));
    return;
  }

  const token = authorizationHeader.slice(7);

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
    const userExists = await UserModel.exists({ _id: decoded.sub });

    if (!userExists) {
      next(new AppError(401, 'Session expired. Please sign in again.'));
      return;
    }

    request.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch {
    next(new AppError(401, 'Unauthorized'));
  }
};

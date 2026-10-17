import type { RequestHandler } from 'express';
import type { ZodTypeAny } from 'zod';
import { AppError } from '../errors/app-error.js';

export const validate = (schema: ZodTypeAny): RequestHandler => {
  return (request, _response, next) => {
    const result = schema.safeParse({
      body: request.body,
      params: request.params,
      query: request.query,
    });

    if (!result.success) {
      next(
        new AppError(
          400,
          result.error.issues.map((issue) => issue.message).join(', ')
        )
      );
      return;
    }

    next();
  };
};

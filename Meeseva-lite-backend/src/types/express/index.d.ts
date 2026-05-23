import 'express-serve-static-core';

declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      email: string;
      role: 'citizen' | 'admin';
    };
    file?: {
      filename: string;
      mimetype: string;
      size: number;
      path: string;
      originalname: string;
    };
  }
}

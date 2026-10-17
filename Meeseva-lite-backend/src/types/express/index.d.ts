export {};

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'citizen' | 'officer' | 'admin';
      };
      file?: {
        filename: string;
        mimetype: string;
        size: number;
        path: string;
        originalname: string;
        buffer?: Buffer;
      };
    }
  }
}

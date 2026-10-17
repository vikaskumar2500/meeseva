import jwt from 'jsonwebtoken';
import { env } from '../../config/env.js';

export const signAccessToken = (payload: {
  userId: string;
  email: string;
  role: 'citizen' | 'admin';
}): string => {
  return jwt.sign(
    { email: payload.email, role: payload.role },
    env.JWT_SECRET,
    {
      subject: payload.userId,
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    }
  );
};

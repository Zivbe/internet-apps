import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../utils/tokens';

export interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }

  const token = header.slice('Bearer '.length).trim();
  try {
    const payload = verifyAccessToken(token);
    req.userId = payload.sub as string;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired access token' });
  }
};

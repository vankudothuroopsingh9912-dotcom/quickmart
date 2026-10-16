import { Request, Response, NextFunction } from 'express';
import { db } from '../db/database';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authorization required. Please log in.' });
  }

  const token = authHeader.split(' ')[1];
  // Simple deterministic token simulation: token format "user-xxx:timestamp" or userId directly
  const userId = token.includes(':') ? token.split(':')[0] : token;
  const user = db.users.find(u => u.id === userId);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session. Please log in again.' });
  }

  req.user = user;
  next();
}

export function adminMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  authMiddleware(req, res, () => {
    if (req.user?.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin privileges required.' });
    }
    next();
  });
}

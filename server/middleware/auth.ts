import { Request, Response, NextFunction } from 'express';
import { db } from '../db/database';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Authentication required. Please sign in.' });
  }

  const token = authHeader.split(' ')[1];
  const userId = token.includes(':') ? token.split(':')[0] : token;
  const user = db.findUserById(userId);

  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid session token. Please sign in again.' });
  }

  if (user.isBlocked) {
    return res.status(403).json({ success: false, message: 'Your account has been suspended by administration.' });
  }

  req.user = user;
  next();
}

export function adminMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  authMiddleware(req, res, () => {
    if (req.user?.role !== 'admin' && req.user?.role !== 'moderator') {
      return res.status(403).json({ success: false, message: 'Administrator privileges required.' });
    }
    next();
  });
}

import { Router } from 'express';
import { db } from '../db/database';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

export const userRouter = Router();

// Search users
userRouter.get('/search', authMiddleware, (req: AuthenticatedRequest, res) => {
  const query = (req.query.q as string || '').trim();
  const currentUserId = req.user.id;

  if (!query) {
    // Return all other active users if no query
    const allUsers = db.users
      .filter(u => u.id !== currentUserId && !u.isBlocked)
      .map(db.sanitizeUser);
    return res.json({ success: true, users: allUsers });
  }

  const results = db.searchUsers(query, currentUserId);
  return res.json({ success: true, users: results });
});

// Get user contacts / all active members
userRouter.get('/contacts', authMiddleware, (req: AuthenticatedRequest, res) => {
  const currentUserId = req.user.id;
  const contacts = db.users
    .filter(u => u.id !== currentUserId && !u.isBlocked)
    .map(u => ({
      ...db.sanitizeUser(u),
      isOnline: db.isUserOnline(u.id) || u.status === 'online'
    }));

  return res.json({ success: true, contacts });
});

// Block / unblock user
userRouter.post('/block/:targetUserId', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { targetUserId } = req.params;
  const user = req.user;

  if (!user.blockedUsers) user.blockedUsers = [];

  const index = user.blockedUsers.indexOf(targetUserId);
  let isBlocked = false;
  if (index > -1) {
    user.blockedUsers.splice(index, 1);
    isBlocked = false;
  } else {
    user.blockedUsers.push(targetUserId);
    isBlocked = true;
  }

  return res.json({
    success: true,
    message: isBlocked ? 'User has been blocked.' : 'User has been unblocked.',
    blockedUsers: user.blockedUsers,
    isBlocked
  });
});

import { Router } from 'express';
import { db } from '../db/database';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';

export const notificationRouter = Router();

// Get notifications
notificationRouter.get('/', authMiddleware, (req: AuthenticatedRequest, res) => {
  const notifs = db.notifications.filter(n => n.userId === req.user.id);
  return res.json({ success: true, notifications: notifs });
});

// Mark single notification as read
notificationRouter.put('/:id/read', authMiddleware, (req: AuthenticatedRequest, res) => {
  const notif = db.notifications.find(n => n.id === req.params.id && n.userId === req.user.id);
  if (notif) notif.read = true;
  return res.json({ success: true });
});

// Mark all as read
notificationRouter.put('/read-all', authMiddleware, (req: AuthenticatedRequest, res) => {
  db.notifications.filter(n => n.userId === req.user.id).forEach(n => (n.read = true));
  return res.json({ success: true });
});

// Clear all notifications
notificationRouter.delete('/', authMiddleware, (req: AuthenticatedRequest, res) => {
  db.notifications = db.notifications.filter(n => n.userId !== req.user.id);
  return res.json({ success: true });
});

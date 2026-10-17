import { Router } from 'express';
import { db } from '../db/database';
import { adminMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { AuditLog, Report } from '../../src/types';

export const adminRouter = Router();

// Apply adminMiddleware to all admin endpoints
adminRouter.use(adminMiddleware);

// Analytics statistics
adminRouter.get('/stats', (req, res) => {
  const totalUsers = db.users.length;
  const activeUsersToday = db.users.filter(u => u.status === 'online' || db.isUserOnline(u.id)).length;
  const totalConversations = db.conversations.length;
  const totalGroups = db.conversations.filter(c => c.type === 'group').length;
  const totalMessages = db.messages.length;
  const pendingReports = db.reports.filter(r => r.status === 'pending').length;

  const messagesTrend = [
    { date: 'Mon', count: 420 },
    { date: 'Tue', count: 580 },
    { date: 'Wed', count: 710 },
    { date: 'Thu', count: 640 },
    { date: 'Fri', count: 890 },
    { date: 'Sat', count: 1120 },
    { date: 'Sun', count: 960 }
  ];

  const activeUsersTrend = [
    { date: 'Mon', count: 120 },
    { date: 'Tue', count: 145 },
    { date: 'Wed', count: 168 },
    { date: 'Thu', count: 160 },
    { date: 'Fri', count: 195 },
    { date: 'Sat', count: 220 },
    { date: 'Sun', count: 210 }
  ];

  return res.json({
    success: true,
    stats: {
      totalUsers,
      activeUsersToday,
      totalConversations,
      totalGroups,
      totalMessages,
      pendingReports,
      messagesTrend,
      activeUsersTrend
    }
  });
});

// Users management
adminRouter.get('/users', (req, res) => {
  const users = db.users.map(u => ({
    ...db.sanitizeUser(u),
    isOnline: db.isUserOnline(u.id) || u.status === 'online',
    conversationCount: db.conversations.filter(c => c.participantIds.includes(u.id)).length,
    messageCount: db.messages.filter(m => m.senderId === u.id).length
  }));
  return res.json({ success: true, users });
});

// Suspend / restore user
adminRouter.post('/users/:id/toggle-suspend', (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const targetUser = db.findUserById(id);

  if (!targetUser) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  targetUser.isBlocked = !targetUser.isBlocked;

  // Add audit log
  const log: AuditLog = {
    id: `log-${Date.now()}`,
    adminId: req.user.id,
    adminName: req.user.name,
    action: targetUser.isBlocked ? 'USER_SUSPENDED' : 'USER_RESTORED',
    target: targetUser.name,
    details: `User status changed to ${targetUser.isBlocked ? 'Suspended' : 'Active'}`,
    createdAt: new Date().toISOString()
  };
  db.auditLogs.unshift(log);

  return res.json({
    success: true,
    message: `User ${targetUser.name} has been ${targetUser.isBlocked ? 'suspended' : 'restored'}.`,
    isBlocked: targetUser.isBlocked
  });
});

// Change user role
adminRouter.put('/users/:id/role', (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { role } = req.body;
  const targetUser = db.findUserById(id);

  if (!targetUser) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  targetUser.role = role;

  const log: AuditLog = {
    id: `log-${Date.now()}`,
    adminId: req.user.id,
    adminName: req.user.name,
    action: 'USER_ROLE_CHANGED',
    target: targetUser.name,
    details: `Role updated to ${role}`,
    createdAt: new Date().toISOString()
  };
  db.auditLogs.unshift(log);

  return res.json({
    success: true,
    message: `Role for ${targetUser.name} updated to ${role}.`,
    user: db.sanitizeUser(targetUser)
  });
});

// Reports management
adminRouter.get('/reports', (req, res) => {
  return res.json({ success: true, reports: db.reports });
});

// Update report status
adminRouter.put('/reports/:id', (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { status, actionTaken } = req.body;
  const report = db.reports.find(r => r.id === id);

  if (!report) {
    return res.status(404).json({ success: false, message: 'Report ticket not found.' });
  }

  report.status = status;
  if (actionTaken) report.actionTaken = actionTaken;

  const log: AuditLog = {
    id: `log-${Date.now()}`,
    adminId: req.user.id,
    adminName: req.user.name,
    action: 'REPORT_RESOLVED',
    target: report.reportedUserName || 'Reported Content',
    details: `Status set to ${status}: ${actionTaken || 'No action required'}`,
    createdAt: new Date().toISOString()
  };
  db.auditLogs.unshift(log);

  return res.json({ success: true, message: 'Report ticket updated.', report });
});

// Audit logs
adminRouter.get('/audit-logs', (req, res) => {
  return res.json({ success: true, auditLogs: db.auditLogs.slice(0, 50) });
});

import { Router } from 'express';
import { db } from '../db/database';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { Conversation } from '../../src/types';

export const conversationRouter = Router();

// Get current user's conversations
conversationRouter.get('/', authMiddleware, (req: AuthenticatedRequest, res) => {
  const conversations = db.getUserConversations(req.user.id);
  return res.json({ success: true, conversations });
});

// Get single conversation details
conversationRouter.get('/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const conv = db.findConversationById(req.params.id);
  if (!conv || !conv.participantIds.includes(req.user.id)) {
    return res.status(404).json({ success: false, message: 'Conversation not found or access denied.' });
  }
  return res.json({ success: true, conversation: conv });
});

// Create or get direct conversation with a user
conversationRouter.post('/direct', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { recipientId } = req.body;
  if (!recipientId) {
    return res.status(400).json({ success: false, message: 'Recipient user ID is required.' });
  }

  const recipient = db.findUserById(recipientId);
  if (!recipient) {
    return res.status(404).json({ success: false, message: 'Recipient user not found.' });
  }

  const conv = db.getOrCreateDirectConversation(req.user.id, recipientId);
  return res.status(201).json({ success: true, conversation: conv });
});

// Create group conversation
conversationRouter.post('/group', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { name, description, avatar, memberIds } = req.body;
  const currentUserId = req.user.id;

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: 'Group name is required.' });
  }

  const allParticipantIds = Array.from(new Set([currentUserId, ...(memberIds || [])]));
  const participants = allParticipantIds
    .map(id => db.findUserById(id))
    .filter(Boolean)
    .map(u => db.sanitizeUser(u!));

  const newGroup: Conversation = {
    id: `conv-grp-${Date.now()}`,
    type: 'group',
    name: name.trim(),
    description: description?.trim() || 'ChatFlow collaborative group.',
    avatar: avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80',
    participants,
    participantIds: allParticipantIds,
    admins: [currentUserId],
    createdBy: currentUserId,
    lastActivity: new Date().toISOString(),
    unreadCount: 0,
    createdAt: new Date().toISOString()
  };

  db.conversations.unshift(newGroup);

  return res.status(201).json({
    success: true,
    message: `Group "${newGroup.name}" created!`,
    conversation: newGroup
  });
});

// Update group information
conversationRouter.put('/:id', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { name, description, avatar } = req.body;
  const conv = db.conversations.find(c => c.id === id);

  if (!conv || conv.type !== 'group') {
    return res.status(404).json({ success: false, message: 'Group not found.' });
  }

  if (!conv.admins?.includes(req.user.id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only group admins can modify group details.' });
  }

  if (name) conv.name = name.trim();
  if (description !== undefined) conv.description = description.trim();
  if (avatar) conv.avatar = avatar;

  return res.json({
    success: true,
    message: 'Group updated successfully!',
    conversation: db.findConversationById(id)
  });
});

// Add members to group
conversationRouter.post('/:id/members', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { userIds } = req.body;
  const conv = db.conversations.find(c => c.id === id);

  if (!conv || conv.type !== 'group') {
    return res.status(404).json({ success: false, message: 'Group not found.' });
  }

  if (!conv.admins?.includes(req.user.id) && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Only group admins can add members.' });
  }

  if (Array.isArray(userIds)) {
    userIds.forEach(uid => {
      if (!conv.participantIds.includes(uid)) {
        conv.participantIds.push(uid);
      }
    });
  }

  return res.json({
    success: true,
    message: 'Members added to group.',
    conversation: db.findConversationById(id)
  });
});

// Remove member from group or leave
conversationRouter.delete('/:id/members/:targetUserId', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { id, targetUserId } = req.params;
  const conv = db.conversations.find(c => c.id === id);

  if (!conv || conv.type !== 'group') {
    return res.status(404).json({ success: false, message: 'Group not found.' });
  }

  const isSelfLeaving = req.user.id === targetUserId;
  const isAdmin = conv.admins?.includes(req.user.id) || req.user.role === 'admin';

  if (!isSelfLeaving && !isAdmin) {
    return res.status(403).json({ success: false, message: 'Only group admins can remove other participants.' });
  }

  conv.participantIds = conv.participantIds.filter(pid => pid !== targetUserId);
  if (conv.admins) {
    conv.admins = conv.admins.filter(aid => aid !== targetUserId);
  }

  return res.json({
    success: true,
    message: isSelfLeaving ? 'You left the group.' : 'Member removed from group.',
    conversation: db.findConversationById(id)
  });
});

// Pin or toggle settings
conversationRouter.patch('/:id/settings', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { isPinned, isMuted, isArchived, pinnedMessageId } = req.body;
  const conv = db.conversations.find(c => c.id === id);

  if (!conv || !conv.participantIds.includes(req.user.id)) {
    return res.status(404).json({ success: false, message: 'Conversation not found.' });
  }

  if (isPinned !== undefined) conv.isPinned = isPinned;
  if (isMuted !== undefined) conv.isMuted = isMuted;
  if (isArchived !== undefined) conv.isArchived = isArchived;
  if (pinnedMessageId !== undefined) conv.pinnedMessageId = pinnedMessageId;

  return res.json({
    success: true,
    conversation: db.findConversationById(id)
  });
});

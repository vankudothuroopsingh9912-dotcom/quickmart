import { Router } from 'express';
import { db } from '../db/database';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { Message } from '../../src/types';

export const messageRouter = Router();

// Get messages for conversation
messageRouter.get('/conversation/:conversationId', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { conversationId } = req.params;
  const { limit, before } = req.query;

  const conv = db.findConversationById(conversationId);
  if (!conv || !conv.participantIds.includes(req.user.id)) {
    return res.status(404).json({ success: false, message: 'Conversation not found or access denied.' });
  }

  const limitNum = parseInt(limit as string, 10) || 50;
  const messages = db.getMessagesByConversation(conversationId, limitNum, before as string);

  return res.json({
    success: true,
    messages
  });
});

// Search messages
messageRouter.get('/search', authMiddleware, (req: AuthenticatedRequest, res) => {
  const query = (req.query.q as string || '').trim().toLowerCase();
  const currentUserId = req.user.id;

  if (!query) {
    return res.json({ success: true, messages: [] });
  }

  // Find conversations user is part of
  const userConvIds = db.conversations
    .filter(c => c.participantIds.includes(currentUserId))
    .map(c => c.id);

  const matched = db.messages
    .filter(m => userConvIds.includes(m.conversationId) && !m.isDeleted)
    .filter(m => m.content.toLowerCase().includes(query))
    .slice(0, 30);

  return res.json({ success: true, messages: matched });
});

// Send message via REST API
messageRouter.post('/', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { conversationId, content, type = 'text', attachments, replyToId } = req.body;
  const currentUserId = req.user.id;

  const conv = db.findConversationById(conversationId);
  if (!conv || !conv.participantIds.includes(currentUserId)) {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }

  const sender = req.user;
  let replyToData = undefined;
  if (replyToId) {
    const original = db.messages.find(m => m.id === replyToId);
    if (original) {
      replyToData = {
        id: original.id,
        senderName: original.sender.name,
        content: original.content,
        type: original.type
      };
    }
  }

  const newMessage: Message = {
    id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    conversationId,
    senderId: currentUserId,
    sender: {
      id: sender.id,
      name: sender.name,
      username: sender.username,
      avatar: sender.avatar
    },
    type,
    content: content || '',
    attachments: attachments || [],
    replyToId,
    replyTo: replyToData,
    reactions: [],
    status: 'delivered',
    readBy: [currentUserId],
    createdAt: new Date().toISOString()
  };

  db.saveMessage(newMessage);

  return res.status(201).json({ success: true, message: newMessage });
});

// React to message
messageRouter.post('/:id/reaction', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { emoji } = req.body;

  const updated = db.toggleMessageReaction(id, emoji, req.user.id, req.user.name);
  if (!updated) {
    return res.status(404).json({ success: false, message: 'Message not found.' });
  }

  return res.json({ success: true, message: updated });
});

// Media upload endpoint (Cloudinary simulation / persistent data uri)
messageRouter.post('/upload', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { fileName, fileType, fileSize, duration, fileData } = req.body;

  if (!fileName) {
    return res.status(400).json({ success: false, message: 'File name is required.' });
  }

  // Generate Cloudinary-style CDN URL or use base64 data uri
  const isImage = fileType?.startsWith('image/');
  const isAudio = fileType?.startsWith('audio/') || fileType === 'voice';

  let resolvedUrl = fileData;
  if (!resolvedUrl || !resolvedUrl.startsWith('data:')) {
    if (isImage) {
      resolvedUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80';
    } else if (isAudio) {
      resolvedUrl = 'https://actions.google.com/sounds/v1/water/waves_crashing_against_cliff.ogg';
    } else {
      resolvedUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
    }
  }

  const attachment = {
    id: `att-${Date.now()}`,
    name: fileName,
    url: resolvedUrl,
    type: fileType || 'application/octet-stream',
    size: fileSize || 102400,
    duration: duration || (isAudio ? 12 : undefined)
  };

  return res.json({
    success: true,
    attachment,
    message: 'File uploaded successfully.'
  });
});

import { Server, Socket } from 'socket.io';
import { db } from '../db/database';
import { Message, MessageType } from '../../src/types';

export function setupSocketIO(io: Server) {
  io.on('connection', (socket: Socket) => {
    const userId = socket.handshake.auth?.userId || (socket.handshake.query?.userId as string);

    if (userId) {
      db.addSocket(userId, socket.id);
      socket.data.userId = userId;

      // Join user's personal notification room
      socket.join(`user:${userId}`);

      // Broadcast user online status
      io.emit('presence:update', {
        userId,
        status: 'online',
        lastSeen: new Date().toISOString()
      });
    }

    // Join a specific conversation room
    socket.on('conversation:join', ({ conversationId }: { conversationId: string }) => {
      if (!conversationId) return;
      socket.join(`conversation:${conversationId}`);
    });

    // Leave a conversation room
    socket.on('conversation:leave', ({ conversationId }: { conversationId: string }) => {
      if (!conversationId) return;
      socket.leave(`conversation:${conversationId}`);
    });

    // Real-time message sending
    socket.on('message:send', (data: {
      conversationId: string;
      content: string;
      type?: MessageType;
      attachments?: any[];
      replyToId?: string;
    }, callback?: (res: any) => void) => {
      const currentUserId = socket.data.userId;
      if (!currentUserId) {
        if (callback) callback({ success: false, error: 'Unauthorized' });
        return;
      }

      const conv = db.findConversationById(data.conversationId);
      if (!conv || !conv.participantIds.includes(currentUserId)) {
        if (callback) callback({ success: false, error: 'Access denied to this conversation' });
        return;
      }

      const sender = db.findUserById(currentUserId);
      if (!sender) return;

      let replyToData = undefined;
      if (data.replyToId) {
        const originalMsg = db.messages.find(m => m.id === data.replyToId);
        if (originalMsg) {
          replyToData = {
            id: originalMsg.id,
            senderName: originalMsg.sender.name,
            content: originalMsg.content,
            type: originalMsg.type
          };
        }
      }

      const newMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        conversationId: data.conversationId,
        senderId: currentUserId,
        sender: {
          id: sender.id,
          name: sender.name,
          username: sender.username,
          avatar: sender.avatar
        },
        type: data.type || 'text',
        content: data.content,
        attachments: data.attachments || [],
        replyToId: data.replyToId,
        replyTo: replyToData,
        reactions: [],
        status: 'delivered',
        readBy: [currentUserId],
        createdAt: new Date().toISOString()
      };

      db.saveMessage(newMessage);

      // Broadcast to room
      io.to(`conversation:${data.conversationId}`).emit('message:receive', newMessage);

      // Notify other participants in the conversation
      conv.participantIds.forEach(pId => {
        if (pId !== currentUserId) {
          io.to(`user:${pId}`).emit('conversation:activity', {
            conversationId: conv.id,
            lastMessage: newMessage
          });

          // Dispatch in-app notification
          db.createNotification({
            userId: pId,
            title: conv.type === 'group' ? `${conv.name} - ${sender.name}` : sender.name,
            message: newMessage.type === 'voice' ? 'Sent a voice note 🎙️' : newMessage.type === 'image' ? 'Sent a photo 📷' : newMessage.content,
            type: 'message',
            relatedId: conv.id
          });

          io.to(`user:${pId}`).emit('notification:new', {
            title: conv.type === 'group' ? `${conv.name} - ${sender.name}` : sender.name,
            message: newMessage.content
          });
        }
      });

      if (callback) {
        callback({ success: true, message: newMessage });
      }
    });

    // Typing start
    socket.on('typing:start', ({ conversationId }: { conversationId: string }) => {
      const currentUserId = socket.data.userId;
      if (!currentUserId) return;
      const user = db.findUserById(currentUserId);
      if (!user) return;

      socket.to(`conversation:${conversationId}`).emit('typing:status', {
        conversationId,
        userId: user.id,
        userName: user.name,
        isTyping: true
      });
    });

    // Typing stop
    socket.on('typing:stop', ({ conversationId }: { conversationId: string }) => {
      const currentUserId = socket.data.userId;
      if (!currentUserId) return;

      socket.to(`conversation:${conversationId}`).emit('typing:status', {
        conversationId,
        userId: currentUserId,
        isTyping: false
      });
    });

    // Message reaction toggle
    socket.on('message:reaction', ({ messageId, emoji }: { messageId: string; emoji: string }) => {
      const currentUserId = socket.data.userId;
      if (!currentUserId) return;
      const user = db.findUserById(currentUserId);
      if (!user) return;

      const updated = db.toggleMessageReaction(messageId, emoji, currentUserId, user.name);
      if (updated) {
        io.to(`conversation:${updated.conversationId}`).emit('message:reaction_update', {
          messageId: updated.id,
          conversationId: updated.conversationId,
          reactions: updated.reactions
        });
      }
    });

    // Mark messages as read
    socket.on('message:read', ({ conversationId }: { conversationId: string }) => {
      const currentUserId = socket.data.userId;
      if (!currentUserId) return;

      const markedIds = db.markMessagesAsRead(conversationId, currentUserId);
      if (markedIds.length > 0) {
        io.to(`conversation:${conversationId}`).emit('receipt:read', {
          conversationId,
          readByUserId: currentUserId,
          messageIds: markedIds
        });
      }
    });

    // Message edit
    socket.on('message:edit', ({ messageId, newContent }: { messageId: string; newContent: string }) => {
      const currentUserId = socket.data.userId;
      if (!currentUserId) return;

      const msg = db.messages.find(m => m.id === messageId);
      if (msg && msg.senderId === currentUserId) {
        msg.content = newContent;
        msg.isEdited = true;
        msg.updatedAt = new Date().toISOString();

        io.to(`conversation:${msg.conversationId}`).emit('message:edited', {
          messageId: msg.id,
          conversationId: msg.conversationId,
          content: msg.content,
          isEdited: true
        });
      }
    });

    // Message delete
    socket.on('message:delete', ({ messageId }: { messageId: string }) => {
      const currentUserId = socket.data.userId;
      if (!currentUserId) return;

      const msg = db.messages.find(m => m.id === messageId);
      if (msg && (msg.senderId === currentUserId || db.findUserById(currentUserId)?.role === 'admin')) {
        msg.isDeleted = true;
        msg.content = 'This message was deleted';
        msg.attachments = [];

        io.to(`conversation:${msg.conversationId}`).emit('message:deleted', {
          messageId: msg.id,
          conversationId: msg.conversationId
        });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      if (userId) {
        db.removeSocket(userId, socket.id);

        if (!db.isUserOnline(userId)) {
          io.emit('presence:update', {
            userId,
            status: 'offline',
            lastSeen: new Date().toISOString()
          });
        }
      }
    });
  });
}

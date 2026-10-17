import {
  User,
  Conversation,
  Message,
  Notification,
  Report,
  AuditLog,
  UserStatus
} from '../../src/types';
import {
  initialUsers,
  initialConversations,
  initialMessages,
  initialNotifications,
  initialReports,
  initialAuditLogs
} from '../data/seedData';

class DatabaseStore {
  public users: (User & { passwordHash: string })[] = JSON.parse(JSON.stringify(initialUsers));
  public conversations: Conversation[] = JSON.parse(JSON.stringify(initialConversations));
  public messages: Message[] = JSON.parse(JSON.stringify(initialMessages));
  public notifications: Notification[] = JSON.parse(JSON.stringify(initialNotifications));
  public reports: Report[] = JSON.parse(JSON.stringify(initialReports));
  public auditLogs: AuditLog[] = JSON.parse(JSON.stringify(initialAuditLogs));

  // Map user ID to active socket IDs
  public userSockets: Map<string, Set<string>> = new Map();

  // Presence helpers
  public addSocket(userId: string, socketId: string) {
    if (!this.userSockets.has(userId)) {
      this.userSockets.set(userId, new Set());
    }
    this.userSockets.get(userId)!.add(socketId);

    const user = this.findUserById(userId);
    if (user && user.status === 'offline') {
      user.status = 'online';
      user.lastSeen = new Date().toISOString();
    }
  }

  public removeSocket(userId: string, socketId: string) {
    const sockets = this.userSockets.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        this.userSockets.delete(userId);
        const user = this.findUserById(userId);
        if (user && user.status === 'online') {
          user.status = 'offline';
          user.lastSeen = new Date().toISOString();
        }
      }
    }
  }

  public isUserOnline(userId: string): boolean {
    const sockets = this.userSockets.get(userId);
    return Boolean(sockets && sockets.size > 0);
  }

  // User queries
  public findUserById(id: string): (User & { passwordHash: string }) | undefined {
    return this.users.find(u => u.id === id);
  }

  public findUserByEmail(email: string): (User & { passwordHash: string }) | undefined {
    return this.users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  }

  public findUserByUsername(username: string): (User & { passwordHash: string }) | undefined {
    return this.users.find(u => u.username.toLowerCase() === username.toLowerCase().trim());
  }

  public searchUsers(query: string, currentUserId: string): User[] {
    const q = query.toLowerCase().trim();
    return this.users
      .filter(u => u.id !== currentUserId && !u.isBlocked)
      .filter(u => u.name.toLowerCase().includes(q) || u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
      .map(this.sanitizeUser);
  }

  public sanitizeUser(user: User & { passwordHash?: string }): User {
    const { passwordHash, ...safe } = user;
    return safe;
  }

  // Conversation queries
  public getUserConversations(userId: string): Conversation[] {
    return this.conversations
      .filter(c => c.participantIds.includes(userId))
      .map(conv => {
        // Populate participants
        const participants = conv.participantIds
          .map(id => this.findUserById(id))
          .filter(Boolean)
          .map(u => this.sanitizeUser(u!));

        // Find last message
        const convMessages = this.messages.filter(m => m.conversationId === conv.id);
        const lastMessage = convMessages.length > 0 ? convMessages[convMessages.length - 1] : undefined;

        // Calculate unread
        const unreadCount = convMessages.filter(
          m => m.senderId !== userId && !m.readBy.includes(userId)
        ).length;

        const pinnedMsg = conv.pinnedMessageId
          ? this.messages.find(m => m.id === conv.pinnedMessageId)
          : undefined;

        return {
          ...conv,
          participants,
          lastMessage,
          unreadCount,
          pinnedMessage: pinnedMsg
        };
      })
      .sort((a, b) => new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime());
  }

  public findConversationById(id: string): Conversation | undefined {
    const conv = this.conversations.find(c => c.id === id);
    if (!conv) return undefined;

    const participants = conv.participantIds
      .map(pId => this.findUserById(pId))
      .filter(Boolean)
      .map(u => this.sanitizeUser(u!));

    const convMessages = this.messages.filter(m => m.conversationId === conv.id);
    const lastMessage = convMessages.length > 0 ? convMessages[convMessages.length - 1] : undefined;
    const pinnedMsg = conv.pinnedMessageId ? this.messages.find(m => m.id === conv.pinnedMessageId) : undefined;

    return {
      ...conv,
      participants,
      lastMessage,
      pinnedMessage: pinnedMsg
    };
  }

  public getOrCreateDirectConversation(user1Id: string, user2Id: string): Conversation {
    const existing = this.conversations.find(
      c => c.type === 'direct' &&
      c.participantIds.includes(user1Id) &&
      c.participantIds.includes(user2Id)
    );

    if (existing) {
      return this.findConversationById(existing.id)!;
    }

    const u1 = this.findUserById(user1Id);
    const u2 = this.findUserById(user2Id);

    const newConv: Conversation = {
      id: `conv-dir-${Date.now()}`,
      type: 'direct',
      participants: [this.sanitizeUser(u1!), this.sanitizeUser(u2!)],
      participantIds: [user1Id, user2Id],
      lastActivity: new Date().toISOString(),
      unreadCount: 0,
      createdAt: new Date().toISOString()
    };

    this.conversations.unshift(newConv);
    return newConv;
  }

  // Messages
  public getMessagesByConversation(conversationId: string, limit = 50, before?: string): Message[] {
    let filtered = this.messages.filter(m => m.conversationId === conversationId);
    if (before) {
      const beforeTime = new Date(before).getTime();
      filtered = filtered.filter(m => new Date(m.createdAt).getTime() < beforeTime);
    }
    return filtered.slice(-limit);
  }

  public saveMessage(message: Message): Message {
    this.messages.push(message);

    // Update conversation lastActivity
    const conv = this.conversations.find(c => c.id === message.conversationId);
    if (conv) {
      conv.lastActivity = message.createdAt;
      conv.lastMessage = message;
    }

    return message;
  }

  public markMessagesAsRead(conversationId: string, userId: string): string[] {
    const markedIds: string[] = [];
    this.messages.forEach(m => {
      if (m.conversationId === conversationId && m.senderId !== userId && !m.readBy.includes(userId)) {
        m.readBy.push(userId);
        m.status = 'read';
        markedIds.push(m.id);
      }
    });
    return markedIds;
  }

  public toggleMessageReaction(messageId: string, emoji: string, userId: string, userName: string): Message | undefined {
    const msg = this.messages.find(m => m.id === messageId);
    if (!msg) return undefined;

    const existingIndex = msg.reactions.findIndex(r => r.emoji === emoji && r.userId === userId);
    if (existingIndex > -1) {
      msg.reactions.splice(existingIndex, 1);
    } else {
      msg.reactions.push({ emoji, userId, userName });
    }
    return msg;
  }

  // Notifications
  public createNotification(data: Omit<Notification, 'id' | 'createdAt' | 'read'>): Notification {
    const notif: Notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      ...data,
      read: false,
      createdAt: new Date().toISOString()
    };
    this.notifications.unshift(notif);
    return notif;
  }
}

export const db = new DatabaseStore();

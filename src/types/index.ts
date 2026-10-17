export type UserStatus = 'online' | 'busy' | 'away' | 'invisible' | 'offline';

export type UserRole = 'user' | 'admin' | 'moderator';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  status: UserStatus;
  customStatus?: string;
  role: UserRole;
  lastSeen: string;
  isBlocked?: boolean;
  blockedUsers?: string[];
  settings?: {
    theme: 'light' | 'dark' | 'system';
    soundEnabled: boolean;
    notificationsEnabled: boolean;
    readReceipts: boolean;
    lastSeenPrivacy: 'everyone' | 'contacts' | 'nobody';
  };
  createdAt: string;
}

export type ConversationType = 'direct' | 'group';

export interface Conversation {
  id: string;
  type: ConversationType;
  participants: User[];
  participantIds: string[];
  name?: string; // For groups
  avatar?: string; // For groups
  description?: string;
  admins?: string[]; // user IDs
  createdBy?: string;
  lastMessage?: Message;
  lastActivity: string;
  unreadCount?: number;
  isPinned?: boolean;
  isMuted?: boolean;
  isArchived?: boolean;
  pinnedMessageId?: string;
  pinnedMessage?: Message;
  createdAt: string;
}

export type MessageType = 'text' | 'image' | 'file' | 'audio' | 'voice' | 'video' | 'system';

export interface MessageReaction {
  emoji: string;
  userId: string;
  userName: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  duration?: number; // For voice/audio notes in seconds
  thumbnailUrl?: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  sender: {
    id: string;
    name: string;
    username: string;
    avatar: string;
  };
  type: MessageType;
  content: string;
  attachments?: Attachment[];
  replyToId?: string;
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
    type: MessageType;
  };
  reactions: MessageReaction[];
  isEdited?: boolean;
  isDeleted?: boolean;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  readBy: string[]; // user IDs
  createdAt: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'message' | 'group_invite' | 'mention' | 'reaction' | 'system';
  relatedId?: string; // conversationId or messageId
  read: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  reportedUserId?: string;
  reportedUserName?: string;
  messageId?: string;
  messageContent?: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  actionTaken?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  target: string;
  details?: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsersToday: number;
  totalConversations: number;
  totalGroups: number;
  totalMessages: number;
  pendingReports: number;
  messagesTrend: { date: string; count: number }[];
  activeUsersTrend: { date: string; count: number }[];
}

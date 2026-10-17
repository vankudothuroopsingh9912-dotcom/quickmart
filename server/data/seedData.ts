import { User, Conversation, Message, Notification, Report, AuditLog } from '../../src/types';

export const initialUsers: (User & { passwordHash: string })[] = [
  {
    id: 'user-alex',
    name: 'Alex Rivera',
    username: 'alex.design',
    email: 'alex@chatflow.com',
    passwordHash: 'alex123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    bio: 'Product Designer & UX Specialist. Crafting intuitive fluid interfaces.',
    status: 'online',
    customStatus: 'Designing the future ✨',
    role: 'user',
    lastSeen: new Date().toISOString(),
    blockedUsers: [],
    settings: {
      theme: 'light',
      soundEnabled: true,
      notificationsEnabled: true,
      readReceipts: true,
      lastSeenPrivacy: 'everyone'
    },
    createdAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'user-sophia',
    name: 'Sophia Chen',
    username: 'sophia.arch',
    email: 'sophia@chatflow.com',
    passwordHash: 'sophia123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    bio: 'Distributed Systems & Real-time Architect. Fan of WebSockets & Rust.',
    status: 'online',
    customStatus: 'Refactoring socket clusters ⚡',
    role: 'user',
    lastSeen: new Date().toISOString(),
    blockedUsers: [],
    settings: {
      theme: 'light',
      soundEnabled: true,
      notificationsEnabled: true,
      readReceipts: true,
      lastSeenPrivacy: 'everyone'
    },
    createdAt: '2026-01-12T09:30:00Z'
  },
  {
    id: 'user-marcus',
    name: 'Marcus Vance',
    username: 'marcus.v',
    email: 'marcus@chatflow.com',
    passwordHash: 'marcus123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    bio: 'Full Stack Engineer. Building high-throughput cloud microservices.',
    status: 'away',
    customStatus: 'In deep focus mode 🎧',
    role: 'user',
    lastSeen: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    blockedUsers: [],
    settings: {
      theme: 'light',
      soundEnabled: true,
      notificationsEnabled: true,
      readReceipts: true,
      lastSeenPrivacy: 'everyone'
    },
    createdAt: '2026-01-15T11:00:00Z'
  },
  {
    id: 'user-elena',
    name: 'Elena Rostova',
    username: 'elena.growth',
    email: 'elena@chatflow.com',
    passwordHash: 'elena123',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    bio: 'Community & Growth Strategist. Passionate about real-time collaboration.',
    status: 'busy',
    customStatus: 'Launching Campaign Q4 🚀',
    role: 'moderator',
    lastSeen: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    blockedUsers: [],
    settings: {
      theme: 'light',
      soundEnabled: true,
      notificationsEnabled: true,
      readReceipts: true,
      lastSeenPrivacy: 'everyone'
    },
    createdAt: '2026-01-20T14:15:00Z'
  },
  {
    id: 'user-admin',
    name: 'ChatFlow Admin',
    username: 'admin',
    email: 'admin@chatflow.com',
    passwordHash: 'admin123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    bio: 'System Administrator & Trust & Safety Moderator for ChatFlow.',
    status: 'online',
    customStatus: 'Monitoring platform health 🛡️',
    role: 'admin',
    lastSeen: new Date().toISOString(),
    blockedUsers: [],
    settings: {
      theme: 'light',
      soundEnabled: true,
      notificationsEnabled: true,
      readReceipts: true,
      lastSeenPrivacy: 'everyone'
    },
    createdAt: '2026-01-01T00:00:00Z'
  }
];

export const initialConversations: Conversation[] = [
  {
    id: 'conv-1',
    type: 'direct',
    participants: [initialUsers[0], initialUsers[1]],
    participantIds: ['user-alex', 'user-sophia'],
    lastActivity: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    isPinned: true,
    unreadCount: 1,
    pinnedMessageId: 'msg-3',
    createdAt: '2026-09-01T10:00:00Z'
  },
  {
    id: 'conv-2',
    type: 'direct',
    participants: [initialUsers[0], initialUsers[2]],
    participantIds: ['user-alex', 'user-marcus'],
    lastActivity: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    unreadCount: 0,
    createdAt: '2026-09-05T12:00:00Z'
  },
  {
    id: 'conv-group-launch',
    type: 'group',
    name: '🚀 Product Launch 2026',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&auto=format&fit=crop&q=80',
    description: 'Cross-functional engineering and design sync for the ChatFlow v2.0 global rollout.',
    participants: [initialUsers[0], initialUsers[1], initialUsers[2], initialUsers[3]],
    participantIds: ['user-alex', 'user-sophia', 'user-marcus', 'user-elena'],
    admins: ['user-alex', 'user-sophia'],
    createdBy: 'user-alex',
    lastActivity: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    isPinned: true,
    unreadCount: 2,
    createdAt: '2026-08-15T09:00:00Z'
  },
  {
    id: 'conv-group-design',
    type: 'group',
    name: '🎨 Design & Creative Sync',
    avatar: 'https://images.unsplash.com/photo-1558655146-d09347e92766?w=200&auto=format&fit=crop&q=80',
    description: 'UI/UX explorations, motion design prototypes, and typography critiques.',
    participants: [initialUsers[0], initialUsers[1], initialUsers[3]],
    participantIds: ['user-alex', 'user-sophia', 'user-elena'],
    admins: ['user-alex'],
    createdBy: 'user-alex',
    lastActivity: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    unreadCount: 0,
    createdAt: '2026-08-20T15:00:00Z'
  }
];

export const initialMessages: Message[] = [
  // Conversation 1: Alex & Sophia
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'user-sophia',
    sender: {
      id: 'user-sophia',
      name: 'Sophia Chen',
      username: 'sophia.arch',
      avatar: initialUsers[1].avatar
    },
    type: 'text',
    content: 'Hey Alex! Did you get a chance to inspect the new WebSocket connection benchmarks?',
    reactions: [{ emoji: '👍', userId: 'user-alex', userName: 'Alex Rivera' }],
    status: 'read',
    readBy: ['user-alex', 'user-sophia'],
    createdAt: new Date(Date.now() - 50 * 60 * 1000).toISOString()
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'user-alex',
    sender: {
      id: 'user-alex',
      name: 'Alex Rivera',
      username: 'alex.design',
      avatar: initialUsers[0].avatar
    },
    type: 'text',
    content: 'Yes! Sub-15ms roundtrip latency across regions. Here is the revised UI mockup for the three-panel layout:',
    attachments: [
      {
        id: 'att-1',
        name: 'chatflow_desktop_preview.png',
        url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
        type: 'image/png',
        size: 2450000
      }
    ],
    reactions: [
      { emoji: '🔥', userId: 'user-sophia', userName: 'Sophia Chen' },
      { emoji: '❤️', userId: 'user-sophia', userName: 'Sophia Chen' }
    ],
    status: 'read',
    readBy: ['user-alex', 'user-sophia'],
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString()
  },
  {
    id: 'msg-3',
    conversationId: 'conv-1',
    senderId: 'user-sophia',
    sender: {
      id: 'user-sophia',
      name: 'Sophia Chen',
      username: 'sophia.arch',
      avatar: initialUsers[1].avatar
    },
    type: 'text',
    content: 'The indigo/violet color scheme is so crisp and clean! Pinned this design spec.',
    replyToId: 'msg-2',
    replyTo: {
      id: 'msg-2',
      senderName: 'Alex Rivera',
      content: 'Here is the revised UI mockup for the three-panel layout',
      type: 'text'
    },
    reactions: [{ emoji: '🚀', userId: 'user-alex', userName: 'Alex Rivera' }],
    status: 'read',
    readBy: ['user-alex', 'user-sophia'],
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString()
  },
  {
    id: 'msg-4',
    conversationId: 'conv-1',
    senderId: 'user-alex',
    sender: {
      id: 'user-alex',
      name: 'Alex Rivera',
      username: 'alex.design',
      avatar: initialUsers[0].avatar
    },
    type: 'voice',
    content: 'Voice note (0:18)',
    attachments: [
      {
        id: 'att-voice-1',
        name: 'voice_note_alex_1.mp3',
        url: 'https://actions.google.com/sounds/v1/water/waves_crashing_against_cliff.ogg',
        type: 'audio/mpeg',
        size: 145000,
        duration: 18
      }
    ],
    reactions: [],
    status: 'read',
    readBy: ['user-alex', 'user-sophia'],
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString()
  },
  {
    id: 'msg-5',
    conversationId: 'conv-1',
    senderId: 'user-sophia',
    sender: {
      id: 'user-sophia',
      name: 'Sophia Chen',
      username: 'sophia.arch',
      avatar: initialUsers[1].avatar
    },
    type: 'text',
    content: 'Awesome ideas on the voice player waveform! Merging the audio streaming pipeline now.',
    reactions: [{ emoji: '👏', userId: 'user-alex', userName: 'Alex Rivera' }],
    status: 'delivered',
    readBy: ['user-sophia'],
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },

  // Conversation 2: Alex & Marcus
  {
    id: 'msg-m-1',
    conversationId: 'conv-2',
    senderId: 'user-marcus',
    sender: {
      id: 'user-marcus',
      name: 'Marcus Vance',
      username: 'marcus.v',
      avatar: initialUsers[2].avatar
    },
    type: 'text',
    content: 'Alex, Cloudinary media pipeline is hooked up with image optimization and thumbnail generation.',
    reactions: [{ emoji: '🙌', userId: 'user-alex', userName: 'Alex Rivera' }],
    status: 'read',
    readBy: ['user-alex', 'user-marcus'],
    createdAt: new Date(Date.now() - 55 * 60 * 1000).toISOString()
  },
  {
    id: 'msg-m-2',
    conversationId: 'conv-2',
    senderId: 'user-alex',
    sender: {
      id: 'user-alex',
      name: 'Alex Rivera',
      username: 'alex.design',
      avatar: initialUsers[0].avatar
    },
    type: 'text',
    content: 'Fantastic work Marcus. Document preview attachments tested great with PDFs and ZIPs.',
    reactions: [],
    status: 'read',
    readBy: ['user-alex', 'user-marcus'],
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  },

  // Group Conversation: Launch 2026
  {
    id: 'msg-g-1',
    conversationId: 'conv-group-launch',
    senderId: 'user-elena',
    sender: {
      id: 'user-elena',
      name: 'Elena Rostova',
      username: 'elena.growth',
      avatar: initialUsers[3].avatar
    },
    type: 'text',
    content: 'Team, early beta tester feedback is overwhelmingly positive! Over 98% love the instant typing indicator and emoji reactions.',
    reactions: [
      { emoji: '🎉', userId: 'user-alex', userName: 'Alex Rivera' },
      { emoji: '❤️', userId: 'user-sophia', userName: 'Sophia Chen' }
    ],
    status: 'read',
    readBy: ['user-elena', 'user-alex', 'user-sophia', 'user-marcus'],
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: 'msg-g-2',
    conversationId: 'conv-group-launch',
    senderId: 'user-sophia',
    sender: {
      id: 'user-sophia',
      name: 'Sophia Chen',
      username: 'sophia.arch',
      avatar: initialUsers[1].avatar
    },
    type: 'text',
    content: 'Just deployed the presence synchronization adapter. Online, away, and busy statuses reflect within 50ms across all connected clients.',
    reactions: [{ emoji: '⚡', userId: 'user-alex', userName: 'Alex Rivera' }],
    status: 'read',
    readBy: ['user-sophia', 'user-alex', 'user-elena'],
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
  },
  {
    id: 'msg-g-3',
    conversationId: 'conv-group-launch',
    senderId: 'user-marcus',
    sender: {
      id: 'user-marcus',
      name: 'Marcus Vance',
      username: 'marcus.v',
      avatar: initialUsers[2].avatar
    },
    type: 'text',
    content: 'Reviewing the admin moderation panel. Automated keyword filtering and report dispatching are operational.',
    reactions: [{ emoji: '🛡️', userId: 'user-elena', userName: 'Elena Rostova' }],
    status: 'delivered',
    readBy: ['user-marcus'],
    createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString()
  }
];

export const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    userId: 'user-alex',
    title: 'New Message from Sophia',
    message: 'Awesome ideas on the voice player waveform!',
    type: 'message',
    relatedId: 'conv-1',
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    id: 'notif-2',
    userId: 'user-alex',
    title: 'New Mention in Product Launch 2026',
    message: 'Marcus mentioned you in team sync.',
    type: 'mention',
    relatedId: 'conv-group-launch',
    read: true,
    createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString()
  }
];

export const initialReports: Report[] = [
  {
    id: 'rep-1',
    reporterId: 'user-elena',
    reporterName: 'Elena Rostova',
    reportedUserId: 'user-spammer',
    reportedUserName: 'SpamBot_99',
    reason: 'Unsolicited promotional links sent to public channels.',
    status: 'pending',
    createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString()
  }
];

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    adminId: 'user-admin',
    adminName: 'ChatFlow Admin',
    action: 'USER_ROLE_UPDATED',
    target: 'Elena Rostova (Moderator)',
    details: 'Elevated role to platform moderator with report resolution capabilities.',
    createdAt: '2026-09-10T12:00:00Z'
  },
  {
    id: 'log-2',
    adminId: 'user-admin',
    adminName: 'ChatFlow Admin',
    action: 'CHANNEL_SETTINGS_MODIFIED',
    target: 'Product Launch 2026',
    details: 'Configured slow-mode messaging and rate limit parameters.',
    createdAt: '2026-09-18T16:30:00Z'
  }
];

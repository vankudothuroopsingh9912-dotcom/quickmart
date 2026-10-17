import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { Conversation, Message, MessageType, User } from '../types';
import { conversationAPI, messageAPI, notificationAPI } from '../services/api';
import { getSocket } from '../services/socket';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface ChatContextType {
  conversations: Conversation[];
  activeConversationId: string | null;
  activeConversation: Conversation | null;
  messages: Message[];
  loadingConversations: boolean;
  loadingMessages: boolean;
  typingUsers: { userId: string; userName: string }[];
  presenceMap: Record<string, { status: string; lastSeen: string }>;
  unreadTotal: number;
  setActiveConversationId: (id: string | null) => void;
  sendMessage: (content: string, type?: MessageType, attachments?: any[], replyToId?: string) => Promise<void>;
  sendVoiceNote: (audioUrl: string, duration: number) => Promise<void>;
  reactToMessage: (messageId: string, emoji: string) => void;
  editMessage: (messageId: string, newContent: string) => void;
  deleteMessage: (messageId: string) => void;
  pinMessageInConversation: (messageId: string) => Promise<void>;
  startTyping: () => void;
  stopTyping: () => void;
  createDirectChat: (recipientId: string) => Promise<Conversation | null>;
  createGroupChat: (name: string, description?: string, avatar?: string, memberIds?: string[]) => Promise<Conversation | null>;
  addMembersToGroup: (conversationId: string, userIds: string[]) => Promise<void>;
  removeMemberFromGroup: (conversationId: string, userId: string) => Promise<void>;
  togglePinConversation: (conversationId: string) => Promise<void>;
  toggleMuteConversation: (conversationId: string) => Promise<void>;
  toggleArchiveConversation: (conversationId: string) => Promise<void>;
  refreshConversations: () => Promise<void>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { showToast, playNotificationSound } = useToast();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});
  const [loadingConversations, setLoadingConversations] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [typingMap, setTypingMap] = useState<Record<string, { userId: string; userName: string }[]>>({});
  const [presenceMap, setPresenceMap] = useState<Record<string, { status: string; lastSeen: string }>>({});

  // Initialize Socket connection
  const socket = useMemo(() => {
    if (!user) return null;
    return getSocket(user.id);
  }, [user]);

  // Load conversations
  const refreshConversations = useCallback(async () => {
    if (!user) return;
    try {
      setLoadingConversations(true);
      const res = await conversationAPI.getConversations();
      if (res.success) {
        setConversations(res.conversations);
        // If no active conversation selected yet on desktop, select the first one
        if (!activeConversationId && res.conversations.length > 0) {
          setActiveConversationId(res.conversations[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoadingConversations(false);
    }
  }, [user, activeConversationId]);

  useEffect(() => {
    refreshConversations();
  }, [refreshConversations]);

  // Active conversation object
  const activeConversation = useMemo(() => {
    return conversations.find(c => c.id === activeConversationId) || null;
  }, [conversations, activeConversationId]);

  // Active messages
  const activeMessages = useMemo(() => {
    if (!activeConversationId) return [];
    return messagesMap[activeConversationId] || [];
  }, [messagesMap, activeConversationId]);

  // Active typing users
  const activeTypingUsers = useMemo(() => {
    if (!activeConversationId) return [];
    return typingMap[activeConversationId] || [];
  }, [typingMap, activeConversationId]);

  // Fetch messages when active conversation changes
  useEffect(() => {
    if (!activeConversationId || !user) return;

    let isMounted = true;
    setLoadingMessages(true);

    // Join socket room
    if (socket) {
      socket.emit('conversation:join', { conversationId: activeConversationId });
      socket.emit('message:read', { conversationId: activeConversationId });
    }

    messageAPI.getMessages(activeConversationId, 60)
      .then(res => {
        if (!isMounted) return;
        if (res.success) {
          setMessagesMap(prev => ({
            ...prev,
            [activeConversationId]: res.messages
          }));

          // Reset unread count locally
          setConversations(prev =>
            prev.map(c => c.id === activeConversationId ? { ...c, unreadCount: 0 } : c)
          );
        }
      })
      .catch(err => console.error('Failed to load messages:', err))
      .finally(() => {
        if (isMounted) setLoadingMessages(false);
      });

    return () => {
      isMounted = false;
      if (socket) {
        socket.emit('conversation:leave', { conversationId: activeConversationId });
      }
    };
  }, [activeConversationId, user, socket]);

  // Socket.IO event listeners
  useEffect(() => {
    if (!socket || !user) return;

    // Presence update
    socket.on('presence:update', (data: { userId: string; status: string; lastSeen: string }) => {
      setPresenceMap(prev => ({
        ...prev,
        [data.userId]: { status: data.status, lastSeen: data.lastSeen }
      }));
    });

    // Receive message
    socket.on('message:receive', (newMsg: Message) => {
      // Idempotent insertion
      setMessagesMap(prev => {
        const existing = prev[newMsg.conversationId] || [];
        if (existing.some(m => m.id === newMsg.id)) return prev;
        return {
          ...prev,
          [newMsg.conversationId]: [...existing, newMsg]
        };
      });

      // Update conversations list latest message
      setConversations(prev => {
        const convIndex = prev.findIndex(c => c.id === newMsg.conversationId);
        if (convIndex === -1) {
          refreshConversations();
          return prev;
        }

        const conv = prev[convIndex];
        const isCurrentActive = newMsg.conversationId === activeConversationId;
        const updatedConv: Conversation = {
          ...conv,
          lastActivity: newMsg.createdAt,
          lastMessage: newMsg,
          unreadCount: isCurrentActive ? 0 : (conv.unreadCount || 0) + 1
        };

        const reordered = [...prev];
        reordered.splice(convIndex, 1);
        return [updatedConv, ...reordered];
      });

      // Sound and notifications if message is not from self
      if (newMsg.senderId !== user.id) {
        playNotificationSound();
        if (newMsg.conversationId !== activeConversationId) {
          showToast(newMsg.content, 'info', `${newMsg.sender.name}`);
        } else {
          // Immediately send read receipt
          socket.emit('message:read', { conversationId: newMsg.conversationId });
        }
      }
    });

    // Typing status
    socket.on('typing:status', (data: { conversationId: string; userId: string; userName: string; isTyping: boolean }) => {
      setTypingMap(prev => {
        const currentList = prev[data.conversationId] || [];
        if (data.isTyping) {
          if (currentList.some(u => u.userId === data.userId)) return prev;
          return {
            ...prev,
            [data.conversationId]: [...currentList, { userId: data.userId, userName: data.userName }]
          };
        } else {
          return {
            ...prev,
            [data.conversationId]: currentList.filter(u => u.userId !== data.userId)
          };
        }
      });
    });

    // Reaction update
    socket.on('message:reaction_update', (data: { messageId: string; conversationId: string; reactions: any[] }) => {
      setMessagesMap(prev => {
        const list = prev[data.conversationId] || [];
        return {
          ...prev,
          [data.conversationId]: list.map(m => m.id === data.messageId ? { ...m, reactions: data.reactions } : m)
        };
      });
    });

    // Read receipt
    socket.on('receipt:read', (data: { conversationId: string; readByUserId: string; messageIds: string[] }) => {
      setMessagesMap(prev => {
        const list = prev[data.conversationId] || [];
        return {
          ...prev,
          [data.conversationId]: list.map(m => {
            if (data.messageIds.includes(m.id)) {
              return {
                ...m,
                status: 'read',
                readBy: Array.from(new Set([...m.readBy, data.readByUserId]))
              };
            }
            return m;
          })
        };
      });
    });

    // Message edited
    socket.on('message:edited', (data: { messageId: string; conversationId: string; content: string; isEdited: boolean }) => {
      setMessagesMap(prev => {
        const list = prev[data.conversationId] || [];
        return {
          ...prev,
          [data.conversationId]: list.map(m => m.id === data.messageId ? { ...m, content: data.content, isEdited: true } : m)
        };
      });
    });

    // Message deleted
    socket.on('message:deleted', (data: { messageId: string; conversationId: string }) => {
      setMessagesMap(prev => {
        const list = prev[data.conversationId] || [];
        return {
          ...prev,
          [data.conversationId]: list.map(m => m.id === data.messageId ? { ...m, isDeleted: true, content: 'This message was deleted', attachments: [] } : m)
        };
      });
    });

    return () => {
      socket.off('presence:update');
      socket.off('message:receive');
      socket.off('typing:status');
      socket.off('message:reaction_update');
      socket.off('receipt:read');
      socket.off('message:edited');
      socket.off('message:deleted');
    };
  }, [socket, user, activeConversationId, playNotificationSound, showToast, refreshConversations]);

  // Send message
  const sendMessage = async (
    content: string,
    type: MessageType = 'text',
    attachments: any[] = [],
    replyToId?: string
  ) => {
    if (!activeConversationId || !user) return;

    if (!content.trim() && attachments.length === 0) return;

    if (socket && socket.connected) {
      socket.emit('message:send', {
        conversationId: activeConversationId,
        content: content.trim(),
        type,
        attachments,
        replyToId
      });
      socket.emit('typing:stop', { conversationId: activeConversationId });
    } else {
      // Fallback via REST API
      const res = await messageAPI.sendMessage({
        conversationId: activeConversationId,
        content: content.trim(),
        type,
        attachments,
        replyToId
      });
      if (res.success) {
        setMessagesMap(prev => ({
          ...prev,
          [activeConversationId]: [...(prev[activeConversationId] || []), res.message]
        }));
      }
    }
  };

  const sendVoiceNote = async (audioUrl: string, duration: number) => {
    const attachment = {
      id: `att-voice-${Date.now()}`,
      name: `Voice note (${Math.round(duration)}s)`,
      url: audioUrl,
      type: 'audio/mpeg',
      size: 120000,
      duration: Math.round(duration)
    };

    await sendMessage(`Voice note (0:${String(Math.round(duration)).padStart(2, '0')})`, 'voice', [attachment]);
  };

  const reactToMessage = (messageId: string, emoji: string) => {
    if (socket && socket.connected) {
      socket.emit('message:reaction', { messageId, emoji });
    } else {
      messageAPI.reactToMessage(messageId, emoji);
    }
  };

  const editMessage = (messageId: string, newContent: string) => {
    if (socket && socket.connected) {
      socket.emit('message:edit', { messageId, newContent });
    }
  };

  const deleteMessage = (messageId: string) => {
    if (socket && socket.connected) {
      socket.emit('message:delete', { messageId });
    }
  };

  const pinMessageInConversation = async (messageId: string) => {
    if (!activeConversationId) return;
    const isCurrentlyPinned = activeConversation?.pinnedMessageId === messageId;
    const newPinId = isCurrentlyPinned ? undefined : messageId;

    await conversationAPI.updateSettings(activeConversationId, { pinnedMessageId: newPinId });
    setConversations(prev =>
      prev.map(c => c.id === activeConversationId ? { ...c, pinnedMessageId: newPinId } : c)
    );
    showToast(isCurrentlyPinned ? 'Message unpinned' : 'Message pinned to top', 'info');
  };

  let typingTimeout: any = null;
  const startTyping = () => {
    if (!socket || !activeConversationId) return;
    socket.emit('typing:start', { conversationId: activeConversationId });

    if (typingTimeout) clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      stopTyping();
    }, 2500);
  };

  const stopTyping = () => {
    if (!socket || !activeConversationId) return;
    socket.emit('typing:stop', { conversationId: activeConversationId });
  };

  const createDirectChat = async (recipientId: string) => {
    try {
      const res = await conversationAPI.createDirect(recipientId);
      if (res.success && res.conversation) {
        setConversations(prev => {
          if (prev.some(c => c.id === res.conversation.id)) return prev;
          return [res.conversation, ...prev];
        });
        setActiveConversationId(res.conversation.id);
        return res.conversation;
      }
      return null;
    } catch (err: any) {
      showToast(err.message || 'Failed to start direct conversation.', 'error');
      return null;
    }
  };

  const createGroupChat = async (name: string, description?: string, avatar?: string, memberIds: string[] = []) => {
    try {
      const res = await conversationAPI.createGroup({ name, description, avatar, memberIds });
      if (res.success && res.conversation) {
        setConversations(prev => [res.conversation, ...prev]);
        setActiveConversationId(res.conversation.id);
        showToast(res.message, 'success');
        return res.conversation;
      }
      return null;
    } catch (err: any) {
      showToast(err.message || 'Failed to create group.', 'error');
      return null;
    }
  };

  const addMembersToGroup = async (conversationId: string, userIds: string[]) => {
    const res = await conversationAPI.addMembers(conversationId, userIds);
    if (res.success && res.conversation) {
      setConversations(prev => prev.map(c => c.id === conversationId ? res.conversation : c));
      showToast(res.message, 'success');
    }
  };

  const removeMemberFromGroup = async (conversationId: string, targetUserId: string) => {
    const res = await conversationAPI.removeMember(conversationId, targetUserId);
    if (res.success && res.conversation) {
      setConversations(prev => prev.map(c => c.id === conversationId ? res.conversation : c));
      showToast(res.message, 'info');
    }
  };

  const togglePinConversation = async (conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) return;
    const newPinned = !conv.isPinned;
    await conversationAPI.updateSettings(conversationId, { isPinned: newPinned });
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, isPinned: newPinned } : c));
    showToast(newPinned ? 'Conversation pinned' : 'Conversation unpinned', 'info');
  };

  const toggleMuteConversation = async (conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) return;
    const newMuted = !conv.isMuted;
    await conversationAPI.updateSettings(conversationId, { isMuted: newMuted });
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, isMuted: newMuted } : c));
    showToast(newMuted ? 'Conversation muted' : 'Conversation unmuted', 'info');
  };

  const toggleArchiveConversation = async (conversationId: string) => {
    const conv = conversations.find(c => c.id === conversationId);
    if (!conv) return;
    const newArchived = !conv.isArchived;
    await conversationAPI.updateSettings(conversationId, { isArchived: newArchived });
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, isArchived: newArchived } : c));
    showToast(newArchived ? 'Conversation archived' : 'Conversation unarchived', 'info');
  };

  const unreadTotal = useMemo(() => {
    return conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  }, [conversations]);

  return (
    <ChatContext.Provider
      value={{
        conversations,
        activeConversationId,
        activeConversation,
        messages: activeMessages,
        loadingConversations,
        loadingMessages,
        typingUsers: activeTypingUsers,
        presenceMap,
        unreadTotal,
        setActiveConversationId,
        sendMessage,
        sendVoiceNote,
        reactToMessage,
        editMessage,
        deleteMessage,
        pinMessageInConversation,
        startTyping,
        stopTyping,
        createDirectChat,
        createGroupChat,
        addMembersToGroup,
        removeMemberFromGroup,
        togglePinConversation,
        toggleMuteConversation,
        toggleArchiveConversation,
        refreshConversations
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}

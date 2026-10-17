import React, { useState } from 'react';
import {
  MessageSquare,
  Users,
  Search,
  Bell,
  Settings,
  Plus,
  Pin,
  VolumeX,
  Archive,
  Check,
  CheckCheck,
  Shield,
  Sun,
  Moon,
  Sparkles,
  LogOut,
  SlidersHorizontal,
  Home
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useTheme } from '../../context/ThemeContext';
import { Conversation } from '../../types';

interface LeftSidebarProps {
  onOpenNewChat: () => void;
  onOpenNotifications: () => void;
  onOpenSettings: () => void;
  onNavigateAdmin: () => void;
  onNavigateHome: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  onOpenNewChat,
  onOpenNotifications,
  onOpenSettings,
  onNavigateAdmin,
  onNavigateHome
}) => {
  const { user, isAdmin } = useAuth();
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    presenceMap,
    unreadTotal,
    togglePinConversation,
    toggleMuteConversation
  } = useChat();

  const { theme, toggleTheme } = useTheme();

  const [filterType, setFilterType] = useState<'all' | 'direct' | 'group'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  if (!user) return null;

  // Filter conversations
  const filtered = conversations.filter(c => {
    if (filterType === 'direct' && c.type !== 'direct') return false;
    if (filterType === 'group' && c.type !== 'group') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const title = c.type === 'group'
        ? (c.name || '')
        : (c.participants.find(p => p.id !== user.id)?.name || '');
      const lastMsg = c.lastMessage?.content || '';
      return title.toLowerCase().includes(q) || lastMsg.toLowerCase().includes(q);
    }
    return true;
  });

  const pinnedConversations = filtered.filter(c => c.isPinned);
  const otherConversations = filtered.filter(c => !c.isPinned);

  const getConversationDetails = (conv: Conversation) => {
    if (conv.type === 'group') {
      return {
        name: conv.name || 'Group Chat',
        avatar: conv.avatar || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
        isOnline: false,
        statusText: `${conv.participantIds.length} members`
      };
    } else {
      const otherUser = conv.participants.find(p => p.id !== user.id) || conv.participants[0] || user;
      const presence = presenceMap[otherUser.id] || { status: otherUser.status, lastSeen: otherUser.lastSeen };
      return {
        name: otherUser.name,
        avatar: otherUser.avatar,
        isOnline: presence.status === 'online',
        statusText: presence.status === 'online' ? 'Online' : 'Offline'
      };
    }
  };

  const formatMessageTime = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 3600 * 24));

    if (diffDays === 0) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else {
      return d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <div className="w-full md:w-80 lg:w-96 flex h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 select-none">
      {/* 1. Left Icon Navigation Rail */}
      <div className="w-16 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-between py-4 border-r border-slate-200/80 dark:border-slate-800 shrink-0">
        <div className="flex flex-col items-center gap-6">
          {/* Brand Logo */}
          <button
            onClick={onNavigateHome}
            title="ChatFlow Home"
            className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 hover:scale-105 transition-transform"
          >
            <MessageSquare className="w-5 h-5" />
          </button>

          {/* Navigation icons */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => setFilterType('all')}
              title="All Conversations"
              className={`p-3 rounded-2xl transition-colors relative ${
                filterType === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              {unreadTotal > 0 && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-orange-500 rounded-full ring-2 ring-white dark:ring-slate-950" />
              )}
            </button>

            <button
              onClick={() => setFilterType('direct')}
              title="Direct Messages"
              className={`p-3 rounded-2xl transition-colors ${
                filterType === 'direct'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800'
              }`}
            >
              <Users className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenNotifications}
              title="Notification Center"
              className="p-3 rounded-2xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors relative"
            >
              <Bell className="w-5 h-5" />
            </button>

            {isAdmin && (
              <button
                onClick={onNavigateAdmin}
                title="Admin Dashboard"
                className="p-3 rounded-2xl text-purple-600 dark:text-purple-400 hover:bg-purple-100/60 dark:hover:bg-purple-950/40 transition-colors"
              >
                <Shield className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Rail Actions */}
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
            className="p-2.5 rounded-xl text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* User Avatar with status dot */}
          <button
            onClick={onOpenSettings}
            title="User Profile & Settings"
            className="relative p-0.5 rounded-full hover:ring-2 hover:ring-indigo-500 transition-all"
          >
            <img
              src={user.avatar}
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700"
            />
            <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
              user.status === 'online' ? 'bg-emerald-500' : user.status === 'busy' ? 'bg-rose-500' : user.status === 'away' ? 'bg-amber-500' : 'bg-slate-400'
            }`} />
          </button>
        </div>
      </div>

      {/* 2. Conversations List Panel */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-white dark:bg-slate-900">
        {/* Top Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
              Messages
            </h1>
            <button
              onClick={onOpenNewChat}
              title="Start New Chat or Group"
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar */}
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats and contacts..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 dark:bg-slate-800/70 border border-transparent dark:border-slate-700/60 rounded-xl text-slate-900 dark:text-slate-100 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all placeholder-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Conversation List Scroll Area */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100/60 dark:divide-slate-800/40 p-2 space-y-0.5">
          {/* Pinned section */}
          {pinnedConversations.length > 0 && (
            <div className="pb-2 mb-2">
              <div className="px-3 py-1 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <Pin className="w-3 h-3 rotate-45 text-indigo-500" /> Pinned Chats
              </div>
              {pinnedConversations.map((conv) => {
                const details = getConversationDetails(conv);
                const isActive = conv.id === activeConversationId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3 relative group ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 shadow-xs'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={details.avatar}
                        alt={details.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                      />
                      {conv.type === 'direct' && (
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                          details.isOnline ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                        }`} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className={`font-bold text-xs truncate ${isActive ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-900 dark:text-slate-100'}`}>
                          {details.name}
                        </h4>
                        {conv.lastMessage && (
                          <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                            {formatMessageTime(conv.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate pr-2">
                          {conv.lastMessage?.type === 'voice'
                            ? '🎙️ Voice message'
                            : conv.lastMessage?.type === 'image'
                            ? '📷 Photo attachment'
                            : conv.lastMessage?.content || 'No messages yet'}
                        </p>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {conv.isMuted && <VolumeX className="w-3 h-3 text-slate-400" />}
                          <Pin className="w-3 h-3 text-indigo-500 rotate-45" />
                          {conv.unreadCount && conv.unreadCount > 0 ? (
                            <span className="px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                              {conv.unreadCount}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* All other conversations */}
          <div>
            {pinnedConversations.length > 0 && (
              <div className="px-3 py-1 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                All Messages
              </div>
            )}

            {filtered.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-400 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                <p>No conversations found.</p>
                <button
                  onClick={onOpenNewChat}
                  className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  Start a new conversation
                </button>
              </div>
            ) : (
              otherConversations.map((conv) => {
                const details = getConversationDetails(conv);
                const isActive = conv.id === activeConversationId;
                return (
                  <div
                    key={conv.id}
                    onClick={() => setActiveConversationId(conv.id)}
                    className={`p-3 rounded-2xl cursor-pointer transition-all flex items-center gap-3 relative group ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 shadow-xs'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <img
                        src={details.avatar}
                        alt={details.name}
                        className="w-12 h-12 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
                      />
                      {conv.type === 'direct' && (
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-slate-900 ${
                          details.isOnline ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                        }`} />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h4 className={`font-bold text-xs truncate ${isActive ? 'text-indigo-900 dark:text-indigo-300' : 'text-slate-900 dark:text-slate-100'}`}>
                          {details.name}
                        </h4>
                        {conv.lastMessage && (
                          <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                            {formatMessageTime(conv.lastMessage.createdAt)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate pr-2">
                          {conv.lastMessage?.type === 'voice'
                            ? '🎙️ Voice note'
                            : conv.lastMessage?.type === 'image'
                            ? '📷 Photo'
                            : conv.lastMessage?.content || 'Say hello! 👋'}
                        </p>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {conv.isMuted && <VolumeX className="w-3 h-3 text-slate-400" />}
                          {conv.unreadCount && conv.unreadCount > 0 ? (
                            <span className="px-1.5 py-0.5 rounded-full bg-indigo-600 text-white text-[10px] font-bold">
                              {conv.unreadCount}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

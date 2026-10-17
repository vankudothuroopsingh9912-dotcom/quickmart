import React, { useState } from 'react';
import {
  X,
  Users,
  Image as ImageIcon,
  FileText,
  Link,
  Shield,
  VolumeX,
  Volume2,
  Pin,
  Ban,
  UserPlus,
  Trash2,
  LogOut,
  Download
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { userAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface RightDetailsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RightDetailsSidebar: React.FC<RightDetailsSidebarProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const {
    activeConversation,
    messages,
    presenceMap,
    toggleMuteConversation,
    togglePinConversation,
    removeMemberFromGroup,
    addMembersToGroup
  } = useChat();

  const { showToast } = useToast();
  const [activeMediaTab, setActiveMediaTab] = useState<'media' | 'docs' | 'members'>('media');

  if (!isOpen || !activeConversation || !user) return null;

  const isGroup = activeConversation.type === 'group';
  const otherUser = isGroup
    ? null
    : activeConversation.participants.find(p => p.id !== user.id) || activeConversation.participants[0] || user;

  const title = isGroup ? activeConversation.name : otherUser?.name;
  const avatar = isGroup ? activeConversation.avatar : otherUser?.avatar;
  const otherPresence = otherUser ? presenceMap[otherUser.id] || { status: otherUser.status, lastSeen: otherUser.lastSeen } : null;

  // Extract shared media from all conversation messages
  const allAttachments = messages.flatMap(m => m.attachments || []);
  const imageAttachments = allAttachments.filter(a => a.type.startsWith('image/'));
  const docAttachments = allAttachments.filter(a => !a.type.startsWith('image/') && !a.type.startsWith('audio/'));

  const isUserGroupAdmin = isGroup && (activeConversation.admins?.includes(user.id) || user.role === 'admin');

  const handleBlockUser = async () => {
    if (!otherUser) return;
    try {
      const res = await userAPI.toggleBlockUser(otherUser.id);
      showToast(res.message, res.isBlocked ? 'warning' : 'info');
    } catch {
      showToast('Action failed.', 'error');
    }
  };

  const handleLeaveGroup = async () => {
    if (!confirm('Are you sure you want to leave this group?')) return;
    await removeMemberFromGroup(activeConversation.id, user.id);
    onClose();
  };

  return (
    <div className="w-80 lg:w-88 h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col shrink-0 select-none animate-fadeIn">
      {/* Header */}
      <div className="h-16 px-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
        <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
          {isGroup ? 'Group Information' : 'Contact Information'}
        </h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Profile Card */}
        <div className="text-center space-y-3">
          <img
            src={avatar}
            alt={title}
            className="w-20 h-20 rounded-3xl mx-auto object-cover border-2 border-indigo-100 dark:border-indigo-900 shadow-md"
          />
          <div>
            <h4 className="font-black text-base text-slate-900 dark:text-slate-100">{title}</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {isGroup ? `${activeConversation.participantIds.length} members` : `@${otherUser?.username}`}
            </p>
          </div>

          {!isGroup && otherUser?.bio && (
            <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 leading-relaxed text-left">
              {otherUser.bio}
            </p>
          )}

          {isGroup && activeConversation.description && (
            <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-2xl border border-slate-100 dark:border-slate-800 leading-relaxed text-left">
              {activeConversation.description}
            </p>
          )}
        </div>

        {/* Quick Conversation Toggles */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            onClick={() => toggleMuteConversation(activeConversation.id)}
            className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-colors ${
              activeConversation.isMuted
                ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
            }`}
          >
            {activeConversation.isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="font-semibold text-[11px]">{activeConversation.isMuted ? 'Unmute' : 'Mute'}</span>
          </button>

          <button
            onClick={() => togglePinConversation(activeConversation.id)}
            className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-colors ${
              activeConversation.isPinned
                ? 'border-indigo-600 bg-indigo-50/80 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300'
                : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Pin className="w-4 h-4 rotate-45" />
            <span className="font-semibold text-[11px]">{activeConversation.isPinned ? 'Unpin' : 'Pin'}</span>
          </button>
        </div>

        {/* Tabs: Media / Files / Members */}
        <div>
          <div className="flex border-b border-slate-100 dark:border-slate-800 mb-4 text-xs font-bold">
            <button
              onClick={() => setActiveMediaTab('media')}
              className={`flex-1 pb-2 border-b-2 transition-colors ${
                activeMediaTab === 'media'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Photos ({imageAttachments.length})
            </button>
            <button
              onClick={() => setActiveMediaTab('docs')}
              className={`flex-1 pb-2 border-b-2 transition-colors ${
                activeMediaTab === 'docs'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              Docs ({docAttachments.length})
            </button>
            {isGroup && (
              <button
                onClick={() => setActiveMediaTab('members')}
                className={`flex-1 pb-2 border-b-2 transition-colors ${
                  activeMediaTab === 'members'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Members ({activeConversation.participants.length})
              </button>
            )}
          </div>

          {/* Tab contents */}
          {activeMediaTab === 'media' && (
            <div className="space-y-2">
              {imageAttachments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No shared photos yet.</p>
              ) : (
                <div className="grid grid-cols-3 gap-2">
                  {imageAttachments.map((img) => (
                    <a
                      key={img.id}
                      href={img.url}
                      target="_blank"
                      rel="noreferrer"
                      className="aspect-square rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 group"
                    >
                      <img src={img.url} alt={img.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeMediaTab === 'docs' && (
            <div className="space-y-2">
              {docAttachments.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">No documents or files shared yet.</p>
              ) : (
                docAttachments.map((doc) => (
                  <a
                    key={doc.id}
                    href={doc.url}
                    download={doc.name}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 border border-slate-100 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200"
                  >
                    <FileText className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span className="truncate flex-1 font-medium">{doc.name}</span>
                    <Download className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  </a>
                ))
              )}
            </div>
          )}

          {activeMediaTab === 'members' && isGroup && (
            <div className="space-y-2.5">
              {activeConversation.participants.map((p) => {
                const isGroupAdmin = activeConversation.admins?.includes(p.id);
                return (
                  <div key={p.id} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-2.5">
                      <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 dark:text-slate-100">{p.name}</span>
                          {isGroupAdmin && (
                            <span className="px-1.5 py-0.2 bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 rounded text-[9px] font-bold">
                              Admin
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-400">@{p.username}</span>
                      </div>
                    </div>

                    {isUserGroupAdmin && p.id !== user.id && (
                      <button
                        onClick={() => removeMemberFromGroup(activeConversation.id, p.id)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="Remove member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Danger zone actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
          {!isGroup ? (
            <button
              onClick={handleBlockUser}
              className="w-full py-2.5 px-3 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Ban className="w-4 h-4" /> Block User
            </button>
          ) : (
            <button
              onClick={handleLeaveGroup}
              className="w-full py-2.5 px-3 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Leave Group
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

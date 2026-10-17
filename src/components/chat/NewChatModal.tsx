import React, { useState, useEffect } from 'react';
import { X, Search, Users, UserPlus, Check, Sparkles, MessageSquare } from 'lucide-react';
import { userAPI } from '../../services/api';
import { User } from '../../types';
import { useChat } from '../../context/ChatContext';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({ isOpen, onClose }) => {
  const { createDirectChat, createGroupChat } = useChat();

  const [mode, setMode] = useState<'direct' | 'group'>('direct');
  const [contacts, setContacts] = useState<(User & { isOnline: boolean })[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  // Group creation form
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      userAPI.getContacts()
        .then(res => {
          if (res.success) setContacts(res.contacts);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredContacts = contacts.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartDirect = async (userId: string) => {
    await createDirectChat(userId);
    onClose();
  };

  const toggleSelectMember = (userId: string) => {
    setSelectedUserIds(prev =>
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    setIsSubmitting(true);
    await createGroupChat(groupName.trim(), groupDescription.trim(), undefined, selectedUserIds);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => setMode('direct')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'direct'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Direct Chat
            </button>
            <button
              type="button"
              onClick={() => setMode('group')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                mode === 'group'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Create Group
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {mode === 'direct' ? (
          <div className="flex-1 flex flex-col p-5 overflow-hidden">
            {/* Search */}
            <div className="relative mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts by name or username..."
                className="w-full pl-9 pr-4 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 pr-1">
              {filteredContacts.length === 0 ? (
                <div className="py-12 text-center text-xs text-slate-400">
                  No contacts found matching "{searchQuery}"
                </div>
              ) : (
                filteredContacts.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleStartDirect(c.id)}
                    className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img src={c.avatar} alt={c.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                        <span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                          c.isOnline ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
                        }`} />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-slate-100">{c.name}</h4>
                        <p className="text-[11px] text-slate-400">@{c.username}</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-lg text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all"
                    >
                      Chat
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateGroup} className="flex-1 flex flex-col p-5 overflow-hidden space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Group Name</label>
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="e.g. Design Systems Sync, Engineering Squad"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Description (Optional)</label>
              <input
                type="text"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                placeholder="What is this channel about?"
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
              />
            </div>

            <div className="flex-1 overflow-hidden flex flex-col">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Select Members ({selectedUserIds.length} selected)
              </label>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl p-2 max-h-48">
                {contacts.map((c) => {
                  const isSelected = selectedUserIds.includes(c.id);
                  return (
                    <div
                      key={c.id}
                      onClick={() => toggleSelectMember(c.id)}
                      className={`p-2 flex items-center justify-between rounded-lg cursor-pointer transition-colors ${
                        isSelected ? 'bg-indigo-50/70 dark:bg-indigo-950/40' : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="font-semibold text-xs text-slate-900 dark:text-slate-100">{c.name}</p>
                          <p className="text-[10px] text-slate-400">@{c.username}</p>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-indigo-600 border-indigo-600 text-white'
                          : 'border-slate-300 dark:border-slate-600'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !groupName.trim()}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/25 disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Group'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

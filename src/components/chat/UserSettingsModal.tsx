import React, { useState } from 'react';
import { X, User, Bell, Volume2, Shield, Moon, Sun, Check, Camera, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { UserStatus } from '../../types';

interface UserSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateLanding?: () => void;
}

export const UserSettingsModal: React.FC<UserSettingsModalProps> = ({
  isOpen,
  onClose,
  onNavigateLanding
}) => {
  const { user, updateProfile, updateStatus, logout, loginAsDemoUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'profile' | 'status' | 'preferences'>('profile');
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [customStatus, setCustomStatus] = useState(user?.customStatus || '');
  const [selectedStatus, setSelectedStatus] = useState<UserStatus>(user?.status || 'online');
  const [soundEnabled, setSoundEnabled] = useState(user?.settings?.soundEnabled ?? true);
  const [readReceipts, setReadReceipts] = useState(user?.settings?.readReceipts ?? true);
  const [saving, setSaving] = useState(false);

  if (!isOpen || !user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile({
      name,
      bio,
      avatar,
      customStatus,
      settings: {
        theme: user.settings?.theme || 'light',
        soundEnabled,
        notificationsEnabled: true,
        readReceipts,
        lastSeenPrivacy: user.settings?.lastSeenPrivacy || 'everyone'
      }
    });
    setSaving(false);
    onClose();
  };

  const handleStatusChange = async (newStatus: UserStatus) => {
    setSelectedStatus(newStatus);
    await updateStatus(newStatus, customStatus);
  };

  const statusOptions: { value: UserStatus; label: string; desc: string; color: string }[] = [
    { value: 'online', label: 'Online', desc: 'Available to receive instant messages', color: 'bg-emerald-500' },
    { value: 'busy', label: 'Do Not Disturb', desc: 'Mute incoming audio notifications', color: 'bg-rose-500' },
    { value: 'away', label: 'Away', desc: 'Temporarily stepping away', color: 'bg-amber-500' },
    { value: 'invisible', label: 'Invisible', desc: 'Appear offline while continuing to chat', color: 'bg-slate-400' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'status'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Presence Status
            </button>
            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'preferences'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                  : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              Preferences
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'profile' && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="flex items-center gap-4 pb-2">
                <div className="relative group">
                  <img
                    src={avatar}
                    alt={user.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-indigo-200 dark:border-indigo-800"
                  />
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">{user.name}</h4>
                  <p className="text-xs text-slate-400">@{user.username} • {user.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Display Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Avatar Image URL</label>
                <input
                  type="text"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">About / Bio</label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition-all"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          )}

          {activeTab === 'status' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Custom Status Message</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={customStatus}
                    onChange={(e) => setCustomStatus(e.target.value)}
                    placeholder="What's happening? (e.g. In meeting 🎧)"
                    className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                  <button
                    type="button"
                    onClick={() => updateStatus(selectedStatus, customStatus)}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
                  >
                    Update
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">Presence Status</label>
                {statusOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => handleStatusChange(opt.value)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                      selectedStatus === opt.value
                        ? 'border-indigo-600 bg-indigo-50/60 dark:bg-indigo-950/40 ring-1 ring-indigo-600'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-3 h-3 rounded-full ${opt.color}`} />
                      <div>
                        <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100">{opt.label}</h5>
                        <p className="text-[11px] text-slate-400">{opt.desc}</p>
                      </div>
                    </div>
                    {selectedStatus === opt.value && <Check className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-5">
              {/* Theme Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  {theme === 'dark' ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-500" />}
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100">Interface Theme</h5>
                    <p className="text-[11px] text-slate-400">Current: {theme === 'dark' ? 'Dark Mode' : 'Light Theme'}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="px-3.5 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
              </div>

              {/* Sound Notifications */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100">Audio Chimes</h5>
                    <p className="text-[11px] text-slate-400">Play pleasant sound on incoming messages</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-4 h-4 accent-indigo-600 rounded"
                />
              </div>

              {/* Switch Demo Accounts */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">Switch Test User (Instant Login)</h5>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => { loginAsDemoUser('alex'); onClose(); }}
                    className="p-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-left hover:bg-indigo-50 dark:hover:bg-slate-800"
                  >
                    Alex Rivera (Designer)
                  </button>
                  <button
                    type="button"
                    onClick={() => { loginAsDemoUser('sophia'); onClose(); }}
                    className="p-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-left hover:bg-indigo-50 dark:hover:bg-slate-800"
                  >
                    Sophia Chen (Architect)
                  </button>
                  <button
                    type="button"
                    onClick={() => { loginAsDemoUser('marcus'); onClose(); }}
                    className="p-2 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 text-left hover:bg-indigo-50 dark:hover:bg-slate-800"
                  >
                    Marcus Vance (Dev)
                  </button>
                  <button
                    type="button"
                    onClick={() => { loginAsDemoUser('admin'); onClose(); }}
                    className="p-2 text-xs font-medium rounded-xl border border-purple-200 dark:border-purple-800 text-left text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/40"
                  >
                    ChatFlow Administrator
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => { logout(); onClose(); if (onNavigateLanding) onNavigateLanding(); }}
                  className="w-full py-2.5 px-4 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" /> Sign Out of Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

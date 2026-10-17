import React, { useState, useEffect } from 'react';
import { X, Bell, Check, Trash2, MessageSquare, AtSign, Users } from 'lucide-react';
import { notificationAPI } from '../../services/api';
import { Notification } from '../../types';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectConversation?: (id: string) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  onSelectConversation
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      notificationAPI.getNotifications()
        .then(res => {
          if (res.success) setNotifications(res.notifications);
        })
        .finally(() => setLoading(false));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMarkAllRead = async () => {
    await notificationAPI.markAllRead();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleClearAll = async () => {
    await notificationAPI.clearAll();
    setNotifications([]);
  };

  const handleItemClick = async (notif: Notification) => {
    if (!notif.read) {
      await notificationAPI.markRead(notif.id);
      setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n));
    }

    if (notif.relatedId && onSelectConversation) {
      onSelectConversation(notif.relatedId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Notifications</h3>
          </div>

          <div className="flex items-center gap-2">
            {notifications.length > 0 && (
              <>
                <button
                  onClick={handleMarkAllRead}
                  title="Mark all as read"
                  className="p-1.5 text-xs text-slate-500 hover:text-indigo-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={handleClearAll}
                  title="Clear all"
                  className="p-1.5 text-xs text-slate-500 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60 p-2">
          {notifications.length === 0 ? (
            <div className="py-16 text-center text-xs text-slate-400">
              No new notifications. You are all caught up!
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`p-3 rounded-2xl cursor-pointer transition-colors flex items-start gap-3 ${
                  n.read
                    ? 'hover:bg-slate-50 dark:hover:bg-slate-800/40 opacity-75'
                    : 'bg-indigo-50/60 dark:bg-indigo-950/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/50'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                  {n.type === 'mention' ? (
                    <AtSign className="w-4 h-4" />
                  ) : n.type === 'group_invite' ? (
                    <Users className="w-4 h-4" />
                  ) : (
                    <MessageSquare className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between mb-0.5">
                    <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 truncate">{n.title}</h5>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{n.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

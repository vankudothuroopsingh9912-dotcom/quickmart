import React, { useState } from 'react';
import { LeftSidebar } from '../components/chat/LeftSidebar';
import { ChatPanel } from '../components/chat/ChatPanel';
import { RightDetailsSidebar } from '../components/chat/RightDetailsSidebar';
import { NewChatModal } from '../components/chat/NewChatModal';
import { NotificationCenterModal } from '../components/chat/NotificationCenterModal';
import { UserSettingsModal } from '../components/chat/UserSettingsModal';
import { useChat } from '../context/ChatContext';

interface ChatAppPageProps {
  onNavigate: (path: string) => void;
}

export const ChatAppPage: React.FC<ChatAppPageProps> = ({ onNavigate }) => {
  const { activeConversationId, setActiveConversationId } = useChat();

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isNotificationsModalOpen, setIsNotificationsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  return (
    <div className="h-screen w-screen overflow-hidden flex bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans">
      {/* 1. Left Sidebar (Conversations List, Navigation, Profiles) */}
      <div
        className={`w-full md:w-80 lg:w-96 shrink-0 h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 ${
          activeConversationId ? 'hidden md:flex flex-col' : 'flex flex-col'
        }`}
      >
        <LeftSidebar
          onOpenNewChat={() => setIsNewChatModalOpen(true)}
          onOpenNotifications={() => setIsNotificationsModalOpen(true)}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
          onNavigateAdmin={() => onNavigate('/admin')}
          onNavigateHome={() => onNavigate('/home')}
        />
      </div>

      {/* 2. Center Panel (Active Conversation & Composer) */}
      <div
        className={`flex-1 h-full min-w-0 bg-slate-50 dark:bg-slate-950 ${
          !activeConversationId ? 'hidden md:flex flex-col' : 'flex flex-col'
        }`}
      >
        <ChatPanel
          onToggleDetails={() => setIsDetailsOpen(prev => !prev)}
          isDetailsOpen={isDetailsOpen}
          onBackMobile={() => setActiveConversationId(null)}
        />
      </div>

      {/* 3. Right Details Sidebar (Participant List, Media, Audio, Docs) */}
      {isDetailsOpen && activeConversationId && (
        <div className="hidden lg:block w-80 xl:w-96 shrink-0 h-full border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-lg">
          <RightDetailsSidebar
            isOpen={isDetailsOpen}
            onClose={() => setIsDetailsOpen(false)}
          />
        </div>
      )}

      {/* Modals */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
      />

      <NotificationCenterModal
        isOpen={isNotificationsModalOpen}
        onClose={() => setIsNotificationsModalOpen(false)}
        onSelectConversation={(convId) => {
          setActiveConversationId(convId);
          setIsNotificationsModalOpen(false);
        }}
      />

      <UserSettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        onNavigateLanding={() => onNavigate('/home')}
      />
    </div>
  );
};

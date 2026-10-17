import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Smile,
  Paperclip,
  Mic,
  MicOff,
  MoreVertical,
  Phone,
  Video,
  Info,
  ChevronLeft,
  X,
  Pin,
  Check,
  CheckCheck,
  FileText,
  Download,
  Trash2,
  Edit2,
  Copy,
  CornerUpLeft,
  Search,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useChat } from '../../context/ChatContext';
import { useToast } from '../../context/ToastContext';
import { Message, MessageType } from '../../types';
import { VoiceNotePlayer } from './VoiceNotePlayer';
import { messageAPI } from '../../services/api';

interface ChatPanelProps {
  onToggleDetails: () => void;
  isDetailsOpen: boolean;
  onBackMobile: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  onToggleDetails,
  isDetailsOpen,
  onBackMobile
}) => {
  const { user } = useAuth();
  const {
    activeConversation,
    messages,
    sendMessage,
    sendVoiceNote,
    reactToMessage,
    editMessage,
    deleteMessage,
    pinMessageInConversation,
    typingUsers,
    startTyping,
    stopTyping,
    presenceMap
  } = useChat();

  const { showToast } = useToast();

  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editInputText, setEditInputText] = useState('');

  // Audio voice note recording
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const recordTimerRef = useRef<any>(null);

  // Image lightbox preview
  const [lightboxImageUrl, setLightboxImageUrl] = useState<string | null>(null);

  // File upload input ref
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingUsers]);

  if (!user || !activeConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950 text-center select-none">
        <div className="w-20 h-20 rounded-3xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 shadow-inner">
          <Sparkles className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
          Welcome to ChatFlow
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
          Select a chat from the left panel or start a new conversation to connect instantly with your team and friends.
        </p>
      </div>
    );
  }

  // Determine conversation partner details
  const isGroup = activeConversation.type === 'group';
  const otherUser = isGroup
    ? null
    : activeConversation.participants.find(p => p.id !== user.id) || activeConversation.participants[0] || user;

  const title = isGroup ? activeConversation.name : otherUser?.name;
  const avatar = isGroup ? activeConversation.avatar : otherUser?.avatar;
  const otherPresence = otherUser ? presenceMap[otherUser.id] || { status: otherUser.status, lastSeen: otherUser.lastSeen } : null;

  const typingInThisChat = typingUsers.filter(u => u.userId !== user.id);

  // Handle send
  const handleSend = async () => {
    if (!inputText.trim()) return;
    const content = inputText;
    setInputText('');
    const replyId = replyingTo?.id;
    setReplyingTo(null);

    await sendMessage(content, 'text', [], replyId);
    stopTyping();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      startTyping();
    }
  };

  // Voice note simulator
  const startRecording = () => {
    setIsRecordingVoice(true);
    setRecordingSeconds(0);
    recordTimerRef.current = setInterval(() => {
      setRecordingSeconds(s => s + 1);
    }, 1000);
  };

  const cancelRecording = () => {
    clearInterval(recordTimerRef.current);
    setIsRecordingVoice(false);
    setRecordingSeconds(0);
  };

  const finishRecording = async () => {
    clearInterval(recordTimerRef.current);
    const duration = Math.max(3, recordingSeconds);
    setIsRecordingVoice(false);
    setRecordingSeconds(0);

    // Audio sample voice note
    const audioUrl = 'https://actions.google.com/sounds/v1/water/waves_crashing_against_cliff.ogg';
    await sendVoiceNote(audioUrl, duration);
    showToast('Voice note dispatched!', 'success');
  };

  // Handle File Upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    showToast(`Uploading ${file.name}...`, 'info');

    // Read as base64 for reliable display
    const reader = new FileReader();
    reader.onload = async () => {
      const base64Data = reader.result as string;
      const fileType = file.type;

      try {
        const res = await messageAPI.uploadMedia({
          fileName: file.name,
          fileType,
          fileSize: file.size,
          fileData: base64Data
        });

        if (res.success && res.attachment) {
          const msgType: MessageType = fileType.startsWith('image/') ? 'image' : 'file';
          await sendMessage(
            msgType === 'image' ? 'Shared an image' : `Shared file: ${file.name}`,
            msgType,
            [res.attachment]
          );
        }
      } catch (err: any) {
        showToast('Upload failed.', 'error');
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const quickEmojis = ['👍', '❤️', '😂', '😮', '😢', '🔥', '🎉', '🚀'];

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
      {/* 1. Chat Header */}
      <div className="h-16 px-4 sm:px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0 shadow-xs z-10">
        <div className="flex items-center gap-3">
          {/* Mobile Back Button */}
          <button
            onClick={onBackMobile}
            className="md:hidden p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-100 rounded-xl"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="relative">
            <img
              src={avatar}
              alt={title}
              className="w-10 h-10 rounded-2xl object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
            />
            {!isGroup && (
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${
                otherPresence?.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
              }`} />
            )}
          </div>

          <div>
            <h2 className="font-extrabold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              {title}
              {activeConversation.isPinned && <Pin className="w-3 h-3 text-indigo-500 rotate-45" />}
            </h2>

            <div className="text-[11px] leading-tight">
              {typingInThisChat.length > 0 ? (
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
                  {typingInThisChat.map(u => u.userName).join(', ')} is typing...
                </span>
              ) : isGroup ? (
                <span className="text-slate-400">{activeConversation.participantIds.length} group participants</span>
              ) : (
                <span className={otherPresence?.status === 'online' ? 'text-emerald-600 font-semibold' : 'text-slate-400'}>
                  {otherPresence?.status === 'online' ? 'Active now' : 'Offline'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => showToast(`Simulating encrypted voice call with ${title}...`, 'info', 'Voice Call')}
            title="Start Voice Call"
            className="p-2.5 rounded-xl text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Phone className="w-4 h-4" />
          </button>

          <button
            onClick={() => showToast(`Simulating HD video meeting with ${title}...`, 'info', 'Video Call')}
            title="Start Video Meeting"
            className="p-2.5 rounded-xl text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Video className="w-4 h-4" />
          </button>

          <button
            onClick={onToggleDetails}
            title={isDetailsOpen ? 'Hide Details' : 'Show Details'}
            className={`p-2.5 rounded-xl transition-colors ${
              isDetailsOpen
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Info className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Pinned Message Banner */}
      {activeConversation.pinnedMessage && (
        <div className="bg-indigo-50/90 dark:bg-indigo-950/40 border-b border-indigo-200/50 dark:border-indigo-800/40 px-4 py-2 flex items-center justify-between text-xs text-indigo-900 dark:text-indigo-200">
          <div className="flex items-center gap-2 truncate">
            <Pin className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 rotate-45 shrink-0" />
            <span className="font-bold truncate">
              Pinned: <span className="font-normal">{activeConversation.pinnedMessage.content}</span>
            </span>
          </div>
          <button
            onClick={() => pinMessageInConversation(activeConversation.pinnedMessage!.id)}
            className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline shrink-0 ml-2"
          >
            Unpin
          </button>
        </div>
      )}

      {/* 3. Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="py-20 text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <Smile className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">No messages yet</h4>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Send a greeting or share an attachment to kickstart the conversation!
            </p>
          </div>
        ) : (
          messages.map((msg, idx) => {
            const isOwn = msg.senderId === user.id;

            return (
              <div
                key={msg.id}
                className={`flex flex-col group ${isOwn ? 'items-end' : 'items-start'}`}
              >
                {/* Sender name for group chats */}
                {isGroup && !isOwn && (
                  <span className="text-[10px] font-bold text-slate-400 ml-12 mb-1">
                    {msg.sender.name}
                  </span>
                )}

                <div className={`flex items-end gap-2 max-w-[85%] sm:max-w-[70%] ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar for other's messages */}
                  {!isOwn && (
                    <img
                      src={msg.sender.avatar}
                      alt={msg.sender.name}
                      className="w-7 h-7 rounded-xl object-cover shrink-0 mb-1"
                    />
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`relative p-3.5 rounded-3xl text-xs sm:text-sm leading-relaxed shadow-xs transition-all ${
                      isOwn
                        ? 'bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white rounded-br-xs'
                        : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-xs border border-slate-200/80 dark:border-slate-700/60'
                    }`}
                  >
                    {/* Reply quote preview if present */}
                    {msg.replyTo && (
                      <div className={`mb-2 p-2 rounded-xl border-l-3 text-[11px] ${
                        isOwn
                          ? 'bg-indigo-800/60 border-indigo-300 text-indigo-100'
                          : 'bg-slate-100 dark:bg-slate-700/50 border-indigo-500 text-slate-600 dark:text-slate-300'
                      }`}>
                        <span className="font-bold block">{msg.replyTo.senderName}</span>
                        <p className="truncate line-clamp-1">{msg.replyTo.content}</p>
                      </div>
                    )}

                    {/* Deleted message indicator */}
                    {msg.isDeleted ? (
                      <p className="italic opacity-60 flex items-center gap-1.5 text-xs">
                        <Trash2 className="w-3.5 h-3.5" /> This message was deleted
                      </p>
                    ) : (
                      <>
                        {/* Attachments rendering */}
                        {msg.attachments && msg.attachments.length > 0 && (
                          <div className="space-y-2 mb-2">
                            {msg.attachments.map((att) => {
                              if (att.type.startsWith('image/')) {
                                return (
                                  <div
                                    key={att.id}
                                    onClick={() => setLightboxImageUrl(att.url)}
                                    className="rounded-2xl overflow-hidden cursor-pointer max-w-sm max-h-60 bg-black/10"
                                  >
                                    <img src={att.url} alt={att.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                                  </div>
                                );
                              } else if (att.type.startsWith('audio/') || msg.type === 'voice') {
                                return (
                                  <VoiceNotePlayer
                                    key={att.id}
                                    url={att.url}
                                    duration={att.duration || 15}
                                    isSender={isOwn}
                                  />
                                );
                              } else {
                                return (
                                  <a
                                    key={att.id}
                                    href={att.url}
                                    download={att.name}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors ${
                                      isOwn
                                        ? 'bg-indigo-700/60 border-indigo-500/50 text-white'
                                        : 'bg-slate-50 dark:bg-slate-700/60 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100'
                                    }`}
                                  >
                                    <FileText className="w-5 h-5 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-xs truncate">{att.name}</p>
                                      <p className="text-[10px] opacity-75">{Math.round(att.size / 1024)} KB</p>
                                    </div>
                                    <Download className="w-4 h-4 shrink-0 opacity-80" />
                                  </a>
                                );
                              }
                            })}
                          </div>
                        )}

                        {/* Text Content */}
                        {msg.type !== 'voice' && (
                          <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                        )}
                      </>
                    )}

                    {/* Metadata footer (Time, Edited, Delivery/Read tick) */}
                    <div className={`flex items-center justify-end gap-1 text-[10px] mt-1 pt-0.5 ${
                      isOwn ? 'text-indigo-200' : 'text-slate-400'
                    }`}>
                      {msg.isEdited && <span className="italic mr-1">(edited)</span>}
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>

                      {isOwn && (
                        <span>
                          {msg.status === 'read' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-blue-300 stroke-[2.5]" />
                          ) : msg.status === 'delivered' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-white/70" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-white/70" />
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Message Action Menu (Hover Toolbar) */}
                  {!msg.isDeleted && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full px-1.5 py-1 shadow-md mb-1 shrink-0">
                      {/* Quick React Button */}
                      <button
                        onClick={() => reactToMessage(msg.id, '❤️')}
                        className="p-1 hover:scale-125 transition-transform text-xs"
                        title="React ❤️"
                      >
                        ❤️
                      </button>
                      <button
                        onClick={() => reactToMessage(msg.id, '👍')}
                        className="p-1 hover:scale-125 transition-transform text-xs"
                        title="React 👍"
                      >
                        👍
                      </button>

                      <button
                        onClick={() => setReplyingTo(msg)}
                        className="p-1 text-slate-500 hover:text-indigo-600 rounded-md"
                        title="Reply"
                      >
                        <CornerUpLeft className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => pinMessageInConversation(msg.id)}
                        className="p-1 text-slate-500 hover:text-indigo-600 rounded-md"
                        title="Pin Message"
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>

                      {isOwn && (
                        <>
                          <button
                            onClick={() => {
                              const newText = prompt('Edit message:', msg.content);
                              if (newText && newText !== msg.content) {
                                editMessage(msg.id, newText);
                              }
                            }}
                            className="p-1 text-slate-500 hover:text-indigo-600 rounded-md"
                            title="Edit"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteMessage(msg.id)}
                            className="p-1 text-slate-500 hover:text-rose-600 rounded-md"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Reaction Badges Container */}
                {msg.reactions && msg.reactions.length > 0 && (
                  <div className={`flex flex-wrap gap-1 mt-1 ${isOwn ? 'mr-2' : 'ml-10'}`}>
                    {Array.from(new Set(msg.reactions.map(r => r.emoji))).map((emoji) => {
                      const count = msg.reactions.filter(r => r.emoji === emoji).length;
                      const hasReacted = msg.reactions.some(r => r.emoji === emoji && r.userId === user.id);
                      return (
                        <button
                          key={emoji}
                          onClick={() => reactToMessage(msg.id, emoji)}
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold border transition-colors ${
                            hasReacted
                              ? 'bg-indigo-100 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-700 text-indigo-700 dark:text-indigo-300 shadow-xs'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <span>{emoji}</span>
                          <span>{count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* 4. Replying Preview Bar */}
      {replyingTo && (
        <div className="bg-slate-100 dark:bg-slate-900 px-6 py-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs animate-fadeIn">
          <div className="flex items-center gap-2 truncate">
            <CornerUpLeft className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="truncate">
              Replying to <strong className="text-indigo-600 dark:text-indigo-400">{replyingTo.sender.name}</strong>: {replyingTo.content}
            </span>
          </div>
          <button
            onClick={() => setReplyingTo(null)}
            className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5. Message Composer Bar */}
      <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shrink-0">
        {isRecordingVoice ? (
          /* Live Audio Recording UI */
          <div className="flex items-center justify-between gap-4 p-2 bg-rose-50 dark:bg-rose-950/40 rounded-2xl border border-rose-200 dark:border-rose-900/60 animate-pulse">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-rose-500 animate-ping" />
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                Recording audio: {Math.floor(recordingSeconds / 60)}:{String(recordingSeconds % 60).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={cancelRecording}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={finishRecording}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <Send className="w-3.5 h-3.5" /> Send Voice Note
              </button>
            </div>
          </div>
        ) : (
          /* Standard Input Bar */
          <div className="flex items-end gap-2">
            {/* Hidden File Input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Attachment Button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Attach photo or document"
              className="p-2.5 rounded-2xl text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            {/* Textarea Input */}
            <div className="flex-1 relative bg-slate-100 dark:bg-slate-800/80 rounded-2xl border border-transparent focus-within:border-indigo-500 dark:focus-within:border-indigo-500/80 transition-all flex items-center">
              <textarea
                rows={1}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a message... (Press Enter to send)"
                className="w-full pl-4 pr-10 py-3 text-xs sm:text-sm bg-transparent text-slate-900 dark:text-slate-100 focus:outline-none resize-none max-h-32 placeholder-slate-400"
              />

              {/* Emoji quick popover button */}
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="p-2 text-slate-400 hover:text-amber-500 absolute right-2"
                title="Insert emoji"
              >
                <Smile className="w-5 h-5" />
              </button>

              {/* Emoji bar popover */}
              {showEmojiPicker && (
                <div className="absolute bottom-full right-0 mb-2 p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl flex items-center gap-1 z-30">
                  {quickEmojis.map((em) => (
                    <button
                      key={em}
                      type="button"
                      onClick={() => {
                        setInputText(prev => prev + em);
                        setShowEmojiPicker(false);
                      }}
                      className="p-1.5 hover:scale-125 transition-transform text-lg"
                    >
                      {em}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Voice record button or Send button */}
            {inputText.trim() ? (
              <button
                type="button"
                onClick={handleSend}
                className="p-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-2xl shadow-md shadow-indigo-600/30 transition-all shrink-0 flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={startRecording}
                title="Record voice note"
                className="p-3 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 rounded-2xl transition-all shrink-0"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal for Full Image preview */}
      {lightboxImageUrl && (
        <div
          onClick={() => setLightboxImageUrl(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn cursor-zoom-out"
        >
          <img
            src={lightboxImageUrl}
            alt="Expanded preview"
            className="max-w-full max-h-[90vh] rounded-2xl shadow-2xl object-contain"
          />
        </div>
      )}
    </div>
  );
};

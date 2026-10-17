import {
  User,
  Conversation,
  Message,
  Notification,
  Report,
  AuditLog,
  AdminStats,
  UserStatus
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('chatflow_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'An error occurred during API request.');
  }
  return data;
}

export const authAPI = {
  async register(body: { name: string; username?: string; email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return handleResponse<{ success: boolean; token: string; user: User; message: string }>(res);
  },

  async login(body: { email: string; password: string }) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    return handleResponse<{ success: boolean; token: string; user: User; message: string }>(res);
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; user: User }>(res);
  },

  async updateProfile(body: { name?: string; bio?: string; avatar?: string; customStatus?: string; settings?: any }) {
    const res = await fetch(`${API_BASE}/auth/profile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse<{ success: boolean; user: User; message: string }>(res);
  },

  async updateStatus(status: UserStatus, customStatus?: string) {
    const res = await fetch(`${API_BASE}/auth/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, customStatus })
    });
    return handleResponse<{ success: boolean; user: User }>(res);
  },

  async forgotPassword(email: string) {
    const res = await fetch(`${API_BASE}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  }
};

export const userAPI = {
  async searchUsers(q: string) {
    const res = await fetch(`${API_BASE}/users/search?q=${encodeURIComponent(q)}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; users: User[] }>(res);
  },

  async getContacts() {
    const res = await fetch(`${API_BASE}/users/contacts`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; contacts: (User & { isOnline: boolean })[] }>(res);
  },

  async toggleBlockUser(userId: string) {
    const res = await fetch(`${API_BASE}/users/block/${userId}`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string; isBlocked: boolean; blockedUsers: string[] }>(res);
  }
};

export const conversationAPI = {
  async getConversations() {
    const res = await fetch(`${API_BASE}/conversations`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; conversations: Conversation[] }>(res);
  },

  async getConversationById(id: string) {
    const res = await fetch(`${API_BASE}/conversations/${id}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; conversation: Conversation }>(res);
  },

  async createDirect(recipientId: string) {
    const res = await fetch(`${API_BASE}/conversations/direct`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ recipientId })
    });
    return handleResponse<{ success: boolean; conversation: Conversation }>(res);
  },

  async createGroup(body: { name: string; description?: string; avatar?: string; memberIds: string[] }) {
    const res = await fetch(`${API_BASE}/conversations/group`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse<{ success: boolean; conversation: Conversation; message: string }>(res);
  },

  async updateGroup(id: string, body: { name?: string; description?: string; avatar?: string }) {
    const res = await fetch(`${API_BASE}/conversations/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse<{ success: boolean; conversation: Conversation; message: string }>(res);
  },

  async addMembers(id: string, userIds: string[]) {
    const res = await fetch(`${API_BASE}/conversations/${id}/members`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ userIds })
    });
    return handleResponse<{ success: boolean; conversation: Conversation; message: string }>(res);
  },

  async removeMember(id: string, targetUserId: string) {
    const res = await fetch(`${API_BASE}/conversations/${id}/members/${targetUserId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; conversation: Conversation; message: string }>(res);
  },

  async updateSettings(id: string, body: { isPinned?: boolean; isMuted?: boolean; isArchived?: boolean; pinnedMessageId?: string }) {
    const res = await fetch(`${API_BASE}/conversations/${id}/settings`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse<{ success: boolean; conversation: Conversation }>(res);
  }
};

export const messageAPI = {
  async getMessages(conversationId: string, limit = 50, before?: string) {
    const query = new URLSearchParams();
    if (limit) query.set('limit', String(limit));
    if (before) query.set('before', before);

    const res = await fetch(`${API_BASE}/messages/conversation/${conversationId}?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; messages: Message[] }>(res);
  },

  async searchMessages(q: string) {
    const res = await fetch(`${API_BASE}/messages/search?q=${encodeURIComponent(q)}`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; messages: Message[] }>(res);
  },

  async sendMessage(body: { conversationId: string; content: string; type?: string; attachments?: any[]; replyToId?: string }) {
    const res = await fetch(`${API_BASE}/messages`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse<{ success: boolean; message: Message }>(res);
  },

  async reactToMessage(messageId: string, emoji: string) {
    const res = await fetch(`${API_BASE}/messages/${messageId}/reaction`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ emoji })
    });
    return handleResponse<{ success: boolean; message: Message }>(res);
  },

  async uploadMedia(body: { fileName: string; fileType?: string; fileSize?: number; duration?: number; fileData?: string }) {
    const res = await fetch(`${API_BASE}/messages/upload`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body)
    });
    return handleResponse<{ success: boolean; attachment: any; message: string }>(res);
  }
};

export const notificationAPI = {
  async getNotifications() {
    const res = await fetch(`${API_BASE}/notifications`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; notifications: Notification[] }>(res);
  },

  async markRead(id: string) {
    const res = await fetch(`${API_BASE}/notifications/${id}/read`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean }>(res);
  },

  async markAllRead() {
    const res = await fetch(`${API_BASE}/notifications/read-all`, {
      method: 'PUT',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean }>(res);
  },

  async clearAll() {
    const res = await fetch(`${API_BASE}/notifications`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean }>(res);
  }
};

export const adminAPI = {
  async getStats() {
    const res = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; stats: AdminStats }>(res);
  },

  async getUsers() {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; users: any[] }>(res);
  },

  async toggleSuspend(userId: string) {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/toggle-suspend`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; message: string; isBlocked: boolean }>(res);
  },

  async updateRole(userId: string, role: string) {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ role })
    });
    return handleResponse<{ success: boolean; message: string; user: User }>(res);
  },

  async getReports() {
    const res = await fetch(`${API_BASE}/admin/reports`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; reports: Report[] }>(res);
  },

  async updateReport(id: string, status: string, actionTaken?: string) {
    const res = await fetch(`${API_BASE}/admin/reports/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status, actionTaken })
    });
    return handleResponse<{ success: boolean; report: Report; message: string }>(res);
  },

  async getAuditLogs() {
    const res = await fetch(`${API_BASE}/admin/audit-logs`, {
      headers: getAuthHeaders()
    });
    return handleResponse<{ success: boolean; auditLogs: AuditLog[] }>(res);
  }
};

import React, { useState, useEffect } from 'react';
import {
  Shield,
  Users,
  MessageSquare,
  AlertTriangle,
  FileText,
  TrendingUp,
  Activity,
  CheckCircle2,
  XCircle,
  Ban,
  Search,
  ArrowLeft,
  RefreshCw,
  Clock,
  Sparkles,
  UserCheck,
  ShieldAlert,
  Moon,
  Sun
} from 'lucide-react';
import { adminAPI } from '../../services/api';
import { AdminStats, Report, AuditLog } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../context/ToastContext';

interface AdminConsoleProps {
  onNavigate: (path: string) => void;
}

export const AdminConsole: React.FC<AdminConsoleProps> = ({ onNavigate }) => {
  const { user, isAdmin, loginAsDemoUser } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports' | 'logs'>('overview');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters
  const [userSearch, setUserSearch] = useState('');
  const [reportFilter, setReportFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('all');

  const loadAllData = async () => {
    try {
      setRefreshing(true);
      const [statsRes, usersRes, reportsRes, logsRes] = await Promise.all([
        adminAPI.getStats(),
        adminAPI.getUsers(),
        adminAPI.getReports(),
        adminAPI.getAuditLogs()
      ]);

      if (statsRes.success) setStats(statsRes.stats);
      if (usersRes.success) setUsers(usersRes.users);
      if (reportsRes.success) setReports(reportsRes.reports);
      if (logsRes.success) setAuditLogs(logsRes.auditLogs);
    } catch (err: any) {
      showToast(err.message || 'Failed to load administration data', 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadAllData();
    } else {
      setLoading(false);
    }
  }, [isAdmin]);

  const handleToggleSuspend = async (userId: string, userName: string) => {
    try {
      const res = await adminAPI.toggleSuspend(userId);
      if (res.success) {
        showToast(`User ${userName} is now ${res.isBlocked ? 'suspended' : 'active'}.`, 'info');
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBlocked: res.isBlocked } : u));
        loadAllData();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update user status', 'error');
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const res = await adminAPI.updateRole(userId, newRole);
      if (res.success) {
        showToast(res.message, 'success');
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
        loadAllData();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update user role', 'error');
    }
  };

  const handleUpdateReport = async (reportId: string, status: 'resolved' | 'dismissed', actionTaken: string) => {
    try {
      const res = await adminAPI.updateReport(reportId, status, actionTaken);
      if (res.success) {
        showToast(`Report ${status}: ${actionTaken}`, 'success');
        setReports(prev => prev.map(r => r.id === reportId ? res.report : r));
        loadAllData();
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to update report', 'error');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto border border-rose-500/30">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white">Administrator Access Required</h1>
            <p className="text-xs text-slate-400 mt-2">
              You must be signed in with an administrative account to access the ChatFlow Admin Console.
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <button
              onClick={() => loginAsDemoUser('admin')}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" /> 1-Click Sign In as System Admin
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="w-full py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl text-xs font-bold transition-colors"
            >
              Back to Chat
            </button>
          </div>
        </div>
      </div>
    );
  }

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredReports = reports.filter(r => {
    if (reportFilter === 'all') return true;
    return r.status === reportFilter;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('/')}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to Chat</span>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-white">ChatFlow</span>
              <span className="text-xs font-semibold text-indigo-400 ml-1.5 uppercase tracking-widest text-[10px] bg-indigo-950/80 px-2 py-0.5 rounded-full border border-indigo-800/60">
                Admin Console
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            disabled={refreshing}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt=""
              className="w-7 h-7 rounded-full object-cover border border-indigo-500/50"
            />
            <span className="text-xs font-bold hidden md:inline text-slate-200">{user?.name}</span>
          </div>
        </div>
      </header>

      {/* Tabs navigation */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-6">
        <div className="flex items-center gap-2 sm:gap-6 overflow-x-auto py-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Overview & Metrics
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'users'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" /> User Accounts ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('reports')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'reports'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" /> Moderation Queue ({reports.filter(r => r.status === 'pending').length} Pending)
          </button>
          <button
            onClick={() => setActiveTab('logs')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 ${
              activeTab === 'logs'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Audit Trail ({auditLogs.length})
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-6">
        {loading ? (
          <div className="py-24 text-center text-slate-500 space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto text-indigo-500" />
            <p className="text-xs">Loading administration records...</p>
          </div>
        ) : activeTab === 'overview' ? (
          /* OVERVIEW TAB */
          <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">Registered Users</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">{stats?.totalUsers || 0}</div>
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
                  <Activity className="w-3 h-3" /> {stats?.activeUsersToday || 0} active today
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">Conversations</span>
                  <div className="w-8 h-8 rounded-xl bg-violet-500/10 text-violet-400 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">{stats?.totalConversations || 0}</div>
                <div className="text-[11px] text-violet-400 font-semibold">
                  {stats?.totalGroups || 0} team channels
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">Total Messages</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">{stats?.totalMessages || 0}</div>
                <div className="text-[11px] text-slate-400">
                  Across text, voice & media
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-xs font-medium">Moderation Queue</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl font-black text-white">{stats?.pendingReports || 0}</div>
                <div className={`text-[11px] font-semibold ${(stats?.pendingReports || 0) > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {(stats?.pendingReports || 0) > 0 ? 'Requires administrative review' : 'No pending flags'}
                </div>
              </div>
            </div>

            {/* Trends and Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Messages Trend */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">Message Volume (Past 7 Days)</h3>
                  <span className="text-xs text-indigo-400 font-medium">Real-time socket sync</span>
                </div>
                <div className="h-44 flex items-end gap-3 pt-6">
                  {stats?.messagesTrend?.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.count}
                      </span>
                      <div
                        className="w-full bg-gradient-to-t from-indigo-700 to-indigo-500 rounded-lg transition-all hover:brightness-125"
                        style={{ height: `${Math.max(15, (item.count / 1200) * 100)}%` }}
                      />
                      <span className="text-[10px] font-semibold text-slate-400">{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Active Users Trend */}
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-white">Daily Active Presence</h3>
                  <span className="text-xs text-emerald-400 font-medium">99.98% cluster uptime</span>
                </div>
                <div className="h-44 flex items-end gap-3 pt-6">
                  {stats?.activeUsersTrend?.map((item, idx) => (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.count}
                      </span>
                      <div
                        className="w-full bg-gradient-to-t from-emerald-700 to-teal-500 rounded-lg transition-all hover:brightness-125"
                        style={{ height: `${Math.max(15, (item.count / 250) * 100)}%` }}
                      />
                      <span className="text-[10px] font-semibold text-slate-400">{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === 'users' ? (
          /* USERS TAB */
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search user by name, username or email..."
                  value={userSearch}
                  onChange={e => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-indigo-500"
                />
              </div>
              <span className="text-xs text-slate-400 self-end sm:self-auto">
                Showing {filteredUsers.length} of {users.length} accounts
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800/60 border-b border-slate-800 text-slate-400 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="px-5 py-3.5">User</th>
                      <th className="px-4 py-3.5">Status</th>
                      <th className="px-4 py-3.5">Role</th>
                      <th className="px-4 py-3.5">Conversations</th>
                      <th className="px-4 py-3.5">Member Since</th>
                      <th className="px-5 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                              alt=""
                              className="w-9 h-9 rounded-full object-cover border border-slate-700"
                            />
                            <div>
                              <div className="font-bold text-white flex items-center gap-1.5">
                                {u.name}
                                {u.isBlocked && (
                                  <span className="px-1.5 py-0.5 rounded-md bg-rose-950 text-rose-400 text-[9px] font-bold border border-rose-800">
                                    Suspended
                                  </span>
                                )}
                              </div>
                              <span className="text-slate-500 text-[11px]">@{u.username} • {u.email}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${u.isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                            <span className="capitalize text-slate-300">{u.isOnline ? 'Online' : u.status || 'Offline'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <select
                            value={u.role || 'user'}
                            onChange={e => handleUpdateRole(u.id, e.target.value)}
                            disabled={u.id === user?.id}
                            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1 focus:outline-hidden focus:border-indigo-500"
                          >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="px-4 py-3.5 text-slate-400">
                          {u.conversationCount || 0} active
                        </td>
                        <td className="px-4 py-3.5 text-slate-400 text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          {u.id !== user?.id && (
                            <button
                              onClick={() => handleToggleSuspend(u.id, u.name)}
                              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 ml-auto ${
                                u.isBlocked
                                  ? 'bg-emerald-950/70 text-emerald-400 hover:bg-emerald-900 border border-emerald-800/60'
                                  : 'bg-rose-950/70 text-rose-400 hover:bg-rose-900 border border-rose-800/60'
                              }`}
                            >
                              <Ban className="w-3.5 h-3.5" />
                              {u.isBlocked ? 'Reactivate' : 'Suspend'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : activeTab === 'reports' ? (
          /* REPORTS TAB */
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setReportFilter('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    reportFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  All ({reports.length})
                </button>
                <button
                  onClick={() => setReportFilter('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    reportFilter === 'pending' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Pending ({reports.filter(r => r.status === 'pending').length})
                </button>
                <button
                  onClick={() => setReportFilter('resolved')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    reportFilter === 'resolved' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  Resolved ({reports.filter(r => r.status === 'resolved').length})
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {filteredReports.length === 0 ? (
                <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-3xl text-slate-500 space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                  <p className="text-sm font-bold text-white">Moderation Queue is Clean</p>
                  <p className="text-xs">No reports currently matching the selected filter.</p>
                </div>
              ) : (
                filteredReports.map(report => (
                  <div
                    key={report.id}
                    className="p-5 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 max-w-2xl">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          report.status === 'pending'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : report.status === 'resolved'
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {report.status}
                        </span>
                        <span className="text-xs text-slate-400">
                          Reported by <strong className="text-slate-200">{report.reporterName}</strong>
                        </span>
                        <span className="text-slate-600">•</span>
                        <span className="text-[11px] text-slate-500">
                          {new Date(report.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="text-xs text-slate-200">
                        <strong>Reason:</strong> <span className="text-rose-400 font-medium">{report.reason}</span>
                      </div>

                      {report.reportedUserName && (
                        <div className="text-xs text-slate-400">
                          <strong>Reported User:</strong> <span className="text-white">{report.reportedUserName}</span>
                        </div>
                      )}

                      {report.messageContent && (
                        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 italic">
                          "{report.messageContent}"
                        </div>
                      )}

                      {report.actionTaken && (
                        <div className="text-[11px] text-emerald-400 font-semibold">
                          Action Taken: {report.actionTaken}
                        </div>
                      )}
                    </div>

                    {report.status === 'pending' && (
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleUpdateReport(report.id, 'dismissed', 'Dismissed as false report')}
                          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors"
                        >
                          Dismiss
                        </button>
                        <button
                          onClick={() => handleUpdateReport(report.id, 'resolved', 'User warned and content flagged')}
                          className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-md shadow-indigo-600/30"
                        >
                          Resolve & Warn
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* AUDIT LOGS TAB */
          <div className="space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              <div className="divide-y divide-slate-800">
                {auditLogs.map(log => (
                  <div key={log.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-850 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{log.adminName}</span>
                        <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-400 text-[10px] font-bold border border-indigo-800">
                          {log.action}
                        </span>
                        <span className="text-slate-400 font-medium">Target: {log.target}</span>
                      </div>
                      {log.details && (
                        <p className="text-[11px] text-slate-400">{log.details}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-[11px] shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(log.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

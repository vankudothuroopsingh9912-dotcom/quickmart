import React, { useState } from 'react';
import { MessageSquare, Lock, Mail, ArrowRight, Sparkles, Shield, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginAsDemoUser } = useAuth();
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      showToast('Please enter your email and password.', 'warning');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      onNavigate('/');
    } catch (err: any) {
      showToast(err.message || 'Invalid email or password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (key: 'alex' | 'sophia' | 'marcus' | 'elena' | 'admin') => {
    setLoading(true);
    try {
      await loginAsDemoUser(key);
      if (key === 'admin') {
        onNavigate('/admin');
      } else {
        onNavigate('/');
      }
    } catch (err: any) {
      showToast(err.message || 'Demo sign in failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 px-4">
        <div
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-2 cursor-pointer group"
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white">
            Chat<span className="text-indigo-600 dark:text-indigo-400">Flow</span>
          </span>
        </div>
        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
          Welcome back
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter your credentials to enter your real-time conversations.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="alex@chatflow.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => onNavigate('/forgot-password')}
                  className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              {loading ? 'Authenticating...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Demo Logins */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              1-Click Demo Accounts
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemoLogin('alex')}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-colors flex items-center gap-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100"
                  alt=""
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <span className="font-bold text-[11px] block truncate text-slate-900 dark:text-white">Alex Rivera</span>
                  <span className="text-[9px] text-slate-400 block truncate">Lead Eng</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('sophia')}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-colors flex items-center gap-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100"
                  alt=""
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <span className="font-bold text-[11px] block truncate text-slate-900 dark:text-white">Sophia Chen</span>
                  <span className="text-[9px] text-slate-400 block truncate">Design VP</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('marcus')}
                className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-indigo-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left transition-colors flex items-center gap-2"
              >
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100"
                  alt=""
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <span className="font-bold text-[11px] block truncate text-slate-900 dark:text-white">Marcus Vance</span>
                  <span className="text-[9px] text-slate-400 block truncate">Architect</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 border border-indigo-200 dark:border-indigo-800 text-left transition-colors flex items-center gap-2"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Shield className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="font-bold text-[11px] block truncate text-indigo-700 dark:text-indigo-300">Admin Portal</span>
                  <span className="text-[9px] text-indigo-500 block truncate">Super Admin</span>
                </div>
              </button>
            </div>
          </div>

          <div className="text-center pt-2">
            <span className="text-xs text-slate-500">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('/register')}
                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Create one now
              </button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

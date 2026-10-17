import React, { useState } from 'react';
import { Mail, ArrowRight, CheckCircle2, MessageSquare, ArrowLeft } from 'lucide-react';
import { authAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

interface ForgotPasswordPageProps {
  onNavigate: (path: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const res = await authAPI.forgotPassword(email);
      setSubmitted(true);
      showToast(res.message, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to process password reset.', 'error');
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
          Reset Password
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Enter your registered email address to receive password recovery instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white dark:bg-slate-900 py-8 px-6 sm:px-10 shadow-xl rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Check Your Inbox</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                We've simulated sending a secure password reset link to <strong>{email}</strong>.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-600/25"
              >
                Back to Sign In
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Registered Email
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                {loading ? 'Sending link...' : 'Send Reset Link'} <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="w-full py-2 text-xs font-semibold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

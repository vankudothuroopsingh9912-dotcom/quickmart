import React, { useState } from 'react';
import { ShoppingCart, Lock, Mail, ArrowRight, UserCheck, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, loginAsDemoCustomer, loginAsDemoAdmin } = useAuth();
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

  const handleDemoCustomer = async () => {
    setLoading(true);
    try {
      await loginAsDemoCustomer();
      onNavigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAdmin = async () => {
    setLoading(true);
    try {
      await loginAsDemoAdmin();
      onNavigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md">
          <ShoppingCart className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to QuickMart</h1>
        <p className="text-xs text-slate-500">Access your orders, saved wishlist, and custom preferences.</p>
      </div>

      {/* Demo Account Quick-Fill Buttons for seamless testing */}
      <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200/80 space-y-2.5">
        <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wider text-center">
          One-Click Instant Demo Login
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleDemoCustomer}
            disabled={loading}
            className="py-2 px-3 bg-white border border-blue-300 rounded-xl text-xs font-bold text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <UserCheck className="w-3.5 h-3.5" /> Customer Demo
          </button>
          <button
            type="button"
            onClick={handleDemoAdmin}
            disabled={loading}
            className="py-2 px-3 bg-white border border-purple-300 rounded-xl text-xs font-bold text-purple-700 hover:bg-purple-600 hover:text-white transition-all shadow-xs flex items-center justify-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5" /> Admin Demo
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@quickmart.com"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => onNavigate('/forgot-password')}
                className="text-xs text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-1.5"
          >
            {loading ? 'Signing In...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <button
            onClick={() => onNavigate('/register')}
            className="text-blue-600 font-bold hover:underline"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};

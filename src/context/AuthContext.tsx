import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserStatus } from '../types';
import { authAPI } from '../services/api';
import { disconnectSocket } from '../services/socket';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updateStatus: (status: UserStatus, customStatus?: string) => Promise<void>;
  loginAsDemoUser: (userKey: 'alex' | 'sophia' | 'marcus' | 'elena' | 'admin') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('chatflow_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('chatflow_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await authAPI.getMe();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem('chatflow_token');
          setToken(null);
        }
      } catch {
        localStorage.removeItem('chatflow_token');
        setToken(null);
      } finally {
        setLoading(false);
      }
    }

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await authAPI.login({ email, password });
    if (data.success) {
      localStorage.setItem('chatflow_token', data.token);
      setToken(data.token);
      setUser(data.user);
      showToast(`Welcome back, ${data.user.name}!`, 'success', 'Signed In');
    }
  };

  const register = async (name: string, username: string, email: string, password: string) => {
    const data = await authAPI.register({ name, username, email, password });
    if (data.success) {
      localStorage.setItem('chatflow_token', data.token);
      setToken(data.token);
      setUser(data.user);
      showToast(`Welcome to ChatFlow, ${data.user.name}!`, 'success', 'Account Created');
    }
  };

  const logout = () => {
    disconnectSocket();
    localStorage.removeItem('chatflow_token');
    setToken(null);
    setUser(null);
    showToast('Signed out of ChatFlow.', 'info');
  };

  const updateProfile = async (data: Partial<User>) => {
    const res = await authAPI.updateProfile(data);
    if (res.success && res.user) {
      setUser(res.user);
      showToast('Profile updated.', 'success');
    }
  };

  const updateStatus = async (status: UserStatus, customStatus?: string) => {
    const res = await authAPI.updateStatus(status, customStatus);
    if (res.success && res.user) {
      setUser(res.user);
      showToast(`Status set to ${status}`, 'info');
    }
  };

  const loginAsDemoUser = async (userKey: 'alex' | 'sophia' | 'marcus' | 'elena' | 'admin') => {
    const demoAccounts: Record<string, { email: string; pass: string }> = {
      alex: { email: 'alex@chatflow.com', pass: 'alex123' },
      sophia: { email: 'sophia@chatflow.com', pass: 'sophia123' },
      marcus: { email: 'marcus@chatflow.com', pass: 'marcus123' },
      elena: { email: 'elena@chatflow.com', pass: 'elena123' },
      admin: { email: 'admin@chatflow.com', pass: 'admin123' }
    };

    const target = demoAccounts[userKey];
    if (target) {
      await login(target.email, target.pass);
    }
  };

  const isAdmin = user?.role === 'admin' || user?.role === 'moderator';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAdmin,
        login,
        register,
        logout,
        updateProfile,
        updateStatus,
        loginAsDemoUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

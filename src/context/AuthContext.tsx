import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Address } from '../types';
import { authAPI } from '../services/api';
import { useToast } from './ToastContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (name?: string, phone?: string) => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  loginAsDemoCustomer: () => Promise<void>;
  loginAsDemoAdmin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('quickmart_token'));
  const [loading, setLoading] = useState<boolean>(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('quickmart_token');
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        const data = await authAPI.getMe();
        if (data.success && data.user) {
          setUser(data.user);
        } else {
          localStorage.removeItem('quickmart_token');
          setToken(null);
        }
      } catch (err) {
        localStorage.removeItem('quickmart_token');
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
      localStorage.setItem('quickmart_token', data.token);
      setToken(data.token);
      setUser(data.user);
      showToast(`Welcome back, ${data.user.name}!`, 'success', 'Login Successful');
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const data = await authAPI.register({ name, email, password, phone });
    if (data.success) {
      localStorage.setItem('quickmart_token', data.token);
      setToken(data.token);
      setUser(data.user);
      showToast(`Welcome to QuickMart, ${data.user.name}!`, 'success', 'Account Created');
    }
  };

  const logout = () => {
    localStorage.removeItem('quickmart_token');
    setToken(null);
    setUser(null);
    showToast('You have been logged out safely.', 'info');
  };

  const updateProfile = async (name?: string, phone?: string) => {
    const data = await authAPI.updateProfile({ name, phone });
    if (data.success && data.user) {
      setUser(data.user);
      showToast('Profile information updated.', 'success');
    }
  };

  const addAddress = async (address: Omit<Address, 'id'>) => {
    const data = await authAPI.addAddress(address);
    if (data.success && user) {
      setUser({ ...user, addresses: data.addresses });
      showToast('Address added to your address book.', 'success');
    }
  };

  const deleteAddress = async (id: string) => {
    const data = await authAPI.deleteAddress(id);
    if (data.success && user) {
      setUser({ ...user, addresses: data.addresses });
      showToast('Address removed.', 'info');
    }
  };

  const loginAsDemoCustomer = async () => {
    await login('sarah@quickmart.com', 'customer123');
  };

  const loginAsDemoAdmin = async () => {
    await login('admin@quickmart.com', 'admin123');
  };

  const isAdmin = user?.role === 'admin';

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
        addAddress,
        deleteAddress,
        loginAsDemoCustomer,
        loginAsDemoAdmin
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

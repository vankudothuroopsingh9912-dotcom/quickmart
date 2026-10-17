import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ChatProvider } from './context/ChatContext';

import { LandingPage } from './pages/LandingPage';
import { ChatAppPage } from './pages/ChatAppPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AdminConsole } from './pages/admin/AdminConsole';
import { NotFoundPage } from './pages/NotFoundPage';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const pathname = currentPath.split('?')[0];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Initializing ChatFlow...</span>
        </div>
      </div>
    );
  }

  // Routing
  if (pathname === '/login') {
    return <LoginPage onNavigate={navigate} />;
  }

  if (pathname === '/register') {
    return <RegisterPage onNavigate={navigate} />;
  }

  if (pathname === '/forgot-password') {
    return <ForgotPasswordPage onNavigate={navigate} />;
  }

  if (pathname === '/admin') {
    return <AdminConsole onNavigate={navigate} />;
  }

  if (pathname === '/home') {
    return (
      <LandingPage
        onGetStarted={() => navigate('/register')}
        onSignIn={() => navigate('/login')}
        onOpenApp={() => navigate('/')}
      />
    );
  }

  if (pathname === '/' || pathname === '/chat') {
    if (!user) {
      // If not logged in and on root, show landing page
      return (
        <LandingPage
          onGetStarted={() => navigate('/register')}
          onSignIn={() => navigate('/login')}
          onOpenApp={() => navigate('/login')}
        />
      );
    }
    return <ChatAppPage onNavigate={navigate} />;
  }

  return <NotFoundPage onNavigate={navigate} />;
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <ChatProvider>
            <AppContent />
          </ChatProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

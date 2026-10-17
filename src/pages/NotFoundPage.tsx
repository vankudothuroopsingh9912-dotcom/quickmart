import React from 'react';
import { MessageSquare, ArrowRight, Home } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-6 font-sans">
      <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-3xl flex items-center justify-center mx-auto text-3xl font-black border border-indigo-200/50 dark:border-indigo-800/50">
        404
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Page Not Found</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          The conversation, channel, or route you were looking for doesn't exist or has moved.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={() => onNavigate('/')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/25 transition-all flex items-center gap-2"
        >
          <Home className="w-4 h-4" /> Return to ChatFlow
        </button>
      </div>
    </div>
  );
};

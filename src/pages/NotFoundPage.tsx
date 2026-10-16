import React from 'react';
import { ShoppingBag, ArrowRight, Home, Compass } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
      <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner text-4xl font-black">
        404
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Page Not Found</h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          The page you're searching for might have been moved, renamed, or is temporarily unavailable.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={() => onNavigate('/')}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md transition-all flex items-center gap-2"
        >
          <Home className="w-4 h-4" /> Go to Homepage
        </button>
        <button
          onClick={() => onNavigate('/shop')}
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2"
        >
          <Compass className="w-4 h-4" /> Browse All Products
        </button>
      </div>
    </div>
  );
};

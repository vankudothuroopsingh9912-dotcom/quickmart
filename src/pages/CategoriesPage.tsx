import React, { useState, useEffect } from 'react';
import { Layers, ArrowRight, Sparkles } from 'lucide-react';
import { categoryAPI } from '../services/api';
import { Category } from '../types';

interface CategoriesPageProps {
  onNavigate: (path: string) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({ onNavigate }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    categoryAPI.getCategories().then(res => {
      if (res.success) setCategories(res.categories);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider">
          <Layers className="w-3.5 h-3.5" /> Department Catalog
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore Product Categories
        </h1>
        <p className="text-sm text-slate-500 leading-relaxed">
          Browse through our extensive departments covering electronics, fashion, beauty, home appliances, sports gear, and daily essentials.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onNavigate(`/shop?category=${cat.slug}`)}
            className="group relative bg-white border border-slate-200/80 rounded-3xl overflow-hidden hover:shadow-xl hover:border-blue-400 transition-all duration-300 cursor-pointer flex flex-col"
          >
            <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                <span className="text-xs font-bold bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg">
                  {cat.productCount} Products
                </span>
                <span className="text-xs font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1 line-clamp-2">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span>Browse {cat.name}</span>
                <span className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  &rarr;
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

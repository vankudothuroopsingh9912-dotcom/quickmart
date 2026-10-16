import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useCompare } from '../../context/CompareContext';
import { useCart } from '../../context/CartContext';
import { RatingStars } from './RatingStars';

interface CompareModalProps {
  onNavigate?: (path: string) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({ onNavigate }) => {
  const { comparedProducts, removeFromCompare, clearCompare, isCompareModalOpen, closeCompareModal } = useCompare();
  const { addToCart } = useCart();

  if (!isCompareModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div
        className="relative bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Compare Products</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Comparing {comparedProducts.length} product{comparedProducts.length !== 1 ? 's' : ''} (up to 4 items)
            </p>
          </div>
          <div className="flex items-center gap-3">
            {comparedProducts.length > 0 && (
              <button
                onClick={clearCompare}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            )}
            <button
              onClick={closeCompareModal}
              className="p-2 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-x-auto p-6">
          {comparedProducts.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-slate-500 mb-4">No products in comparison list.</p>
              <button
                onClick={closeCompareModal}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            <div className="min-w-[650px]">
              <div className="grid grid-cols-4 gap-4">
                {comparedProducts.map((p) => (
                  <div key={p.id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 flex flex-col">
                    <div className="flex justify-end mb-2">
                      <button
                        onClick={() => removeFromCompare(p.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Remove"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="aspect-square w-full rounded-xl bg-white overflow-hidden mb-3 border border-slate-200">
                      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />
                    </div>

                    <span className="text-xs font-bold text-blue-600 uppercase mb-1">{p.brand}</span>
                    <h4
                      onClick={() => {
                        closeCompareModal();
                        if (onNavigate) onNavigate(`/product/${p.id}`);
                      }}
                      className="font-semibold text-sm text-slate-900 line-clamp-2 hover:text-blue-600 cursor-pointer mb-2"
                    >
                      {p.name}
                    </h4>

                    <div className="mb-2">
                      <RatingStars rating={p.rating} showText reviewCount={p.reviewCount} size={13} />
                    </div>

                    <div className="text-lg font-bold text-slate-900 mb-3">${p.price.toFixed(2)}</div>

                    <div className="space-y-2 text-xs border-t border-slate-200 pt-3 mb-4 flex-1">
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Availability</span>
                        <span className={`font-semibold ${p.stock > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {p.stock > 0 ? `In Stock (${p.stock})` : 'Out of Stock'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] uppercase">Category</span>
                        <span className="capitalize text-slate-700">{p.category.replace('-', ' ')}</span>
                      </div>
                      {p.specifications && p.specifications.slice(0, 3).map((spec, idx) => (
                        <div key={idx}>
                          <span className="text-slate-400 block text-[10px] uppercase">{spec.name}</span>
                          <span className="text-slate-700">{spec.value}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        addToCart(p, 1);
                        closeCompareModal();
                      }}
                      disabled={p.stock <= 0}
                      className={`w-full py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-xs transition-colors ${
                        p.stock <= 0
                          ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

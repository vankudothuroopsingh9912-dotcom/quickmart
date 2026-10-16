import React, { useState, useEffect } from 'react';
import { Flame, Clock, Tag, Copy, Check, Zap, ArrowRight } from 'lucide-react';
import { Product, Coupon } from '../types';
import { productAPI, couponAPI } from '../services/api';
import { ProductCard } from '../components/common/ProductCard';
import { useToast } from '../context/ToastContext';

interface DealsPageProps {
  onNavigate: (path: string) => void;
  onQuickView: (product: Product) => void;
}

export const DealsPage: React.FC<DealsPageProps> = ({ onNavigate, onQuickView }) => {
  const [deals, setDeals] = useState<Product[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { showToast } = useToast();

  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Promise.all([productAPI.getDeals(), couponAPI.getCoupons()])
      .then(([dealsRes, couponsRes]) => {
        if (dealsRes.success) setDeals(dealsRes.products);
        if (couponsRes.success) setCoupons(couponsRes.coupons);
      })
      .catch(err => console.error('Failed to load deals:', err))
      .finally(() => setLoading(false));
  }, []);

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`Coupon code ${code} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Banner */}
      <div className="bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider backdrop-blur-xs">
            <Zap className="w-3.5 h-3.5 fill-current" /> Daily Mega Price Drops
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Flash Deals & Promo Offers
          </h1>
          <p className="text-xs sm:text-sm text-orange-100 max-w-lg">
            Unbeatable savings on audio gear, smartphones, kitchen appliances, and fashion sneakers. Hurry before stock runs out!
          </p>
        </div>

        {/* Live Timer */}
        <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md p-3.5 rounded-2xl border border-white/20">
          <Clock className="w-5 h-5 text-orange-300" />
          <div className="flex items-center gap-1.5 text-center">
            <div className="bg-white text-slate-900 rounded-lg px-2.5 py-1 font-mono font-extrabold text-sm sm:text-base">
              {String(timeLeft.hours).padStart(2, '0')}
            </div>
            <span className="font-bold text-white">:</span>
            <div className="bg-white text-slate-900 rounded-lg px-2.5 py-1 font-mono font-extrabold text-sm sm:text-base">
              {String(timeLeft.minutes).padStart(2, '0')}
            </div>
            <span className="font-bold text-white">:</span>
            <div className="bg-white text-slate-900 rounded-lg px-2.5 py-1 font-mono font-extrabold text-sm sm:text-base">
              {String(timeLeft.seconds).padStart(2, '0')}
            </div>
          </div>
        </div>
      </div>

      {/* Coupons Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-bold text-slate-900">Active Promo Coupons</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {coupons.map((c) => (
            <div
              key={c.code}
              className="bg-white border-2 border-dashed border-blue-200 rounded-2xl p-4 flex flex-col justify-between hover:border-blue-400 transition-colors shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono font-black text-sm text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                    {c.code}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    {c.discountPercentage}% OFF
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{c.description}</p>
              </div>

              <button
                type="button"
                onClick={() => handleCopyCoupon(c.code)}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  copiedCode === c.code
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {copiedCode === c.code ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Code
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Deals Products Grid */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Items on Sale</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {deals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

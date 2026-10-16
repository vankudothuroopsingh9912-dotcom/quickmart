import React, { useState, useEffect } from 'react';
import {
  Flame,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Award,
  ChevronRight,
  Zap,
  Tag,
  Star,
  Quote,
  Clock
} from 'lucide-react';
import { ProductCard } from '../components/common/ProductCard';
import { Product, Category } from '../types';
import { productAPI, categoryAPI } from '../services/api';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onQuickView: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onQuickView }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [dealProducts, setDealProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Live countdown timer for Flash Deals (e.g. 23 hours, 45 mins, 12 secs)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 24, minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    async function loadData() {
      try {
        const [catsRes, featRes, dealsRes] = await Promise.all([
          categoryAPI.getCategories(),
          productAPI.getFeatured(),
          productAPI.getDeals()
        ]);

        if (catsRes.success) setCategories(catsRes.categories);
        if (featRes.success) setFeaturedProducts(featRes.products);
        if (dealsRes.success) setDealProducts(dealsRes.products);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const testimonials = [
    {
      name: 'Jessica Parker',
      role: 'Verified Buyer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      comment: 'Ordered the AcousticPro headphones and received them the next afternoon! Seamless tracking and crisp sound quality.',
      rating: 5,
      product: 'AcousticPro ANC Headphones'
    },
    {
      name: 'Marcus Vance',
      role: 'Tech Enthusiast',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      comment: 'QuickMart is now my default e-commerce site. The checkout was lightning fast, coupon discount worked instantly, and the packaging was immaculate.',
      rating: 5,
      product: 'Aero 14 Pro 5G Flagship'
    },
    {
      name: 'Elena Rostova',
      role: 'Home Chef',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      comment: 'The BaristaTouch espresso maker arrived with genuine guarantee documents. Excellent customer service through and through.',
      rating: 5,
      product: 'BaristaTouch Espresso Maker'
    }
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-slate-900/95 to-slate-950/80 z-10" />
        <img
          src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1600&auto=format&fit=crop&q=80"
          alt="QuickMart store"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-30 mix-blend-overlay"
        />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-orange-400" />
              <span>Fall Mega Season Sale is Live</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Everything You Need, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-orange-400">
                Just a Click Away.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              Shop over 10,000 top-tier gadgets, fashionable apparel, home essentials, and gourmet groceries. Fast doorstep shipping with instant live tracking.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={() => onNavigate('/shop')}
                className="px-7 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                Shop All Products <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onNavigate('/deals')}
                className="px-7 py-3.5 rounded-xl bg-orange-600 hover:bg-orange-500 active:scale-95 text-white font-bold text-sm shadow-lg shadow-orange-600/30 transition-all flex items-center gap-2"
              >
                <Flame className="w-4 h-4" /> Explore Flash Deals
              </button>
            </div>

            <div className="pt-4 flex items-center gap-6 text-xs text-slate-400 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base">4.9/5</span>
                <span>Customer Rating</span>
              </div>
              <div className="w-1 h-1 bg-slate-700 rounded-full" />
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base">30-Day</span>
                <span>Easy Returns</span>
              </div>
              <div className="w-1 h-1 bg-slate-700 rounded-full" />
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base">100%</span>
                <span>Genuine Guarantee</span>
              </div>
            </div>
          </div>

          {/* Hero Promo Card */}
          <div className="lg:w-96 w-full shrink-0">
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 text-white shadow-2xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-orange-500 text-white font-black text-xs uppercase tracking-wider">
                  Today's Pick
                </span>
                <span className="text-xs text-slate-300">Limited Stock</span>
              </div>

              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-800">
                <img
                  src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80"
                  alt="AcousticPro ANC Wireless Headphones"
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h4 className="font-bold text-base text-white">AcousticPro ANC Headphones</h4>
                <p className="text-xs text-slate-300 line-clamp-1 mt-0.5">Studio-grade titanium drivers & 45h battery</p>
              </div>

              <div className="flex items-baseline justify-between pt-2 border-t border-white/10">
                <div>
                  <span className="text-2xl font-black text-white">$199.99</span>
                  <span className="text-xs text-slate-400 line-through ml-2">$279.99</span>
                </div>
                <button
                  onClick={() => onNavigate('/product/prod-elec-1')}
                  className="px-4 py-2 bg-white text-slate-900 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors shadow-sm"
                >
                  View Offer
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Shop By Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
              <Tag className="w-3.5 h-3.5" /> Curated Departments
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Shop by Category
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/categories')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            All Categories <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.slice(0, 10).map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate(`/shop?category=${cat.slug}`)}
              className="group relative bg-white border border-slate-200/80 rounded-2xl p-4 hover:border-blue-400 hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col items-center text-center"
            >
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-50 mb-3 border border-slate-100 group-hover:scale-105 transition-transform duration-300">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
              </div>
              <h3 className="font-bold text-sm text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{cat.productCount} Products</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Flash Deals Section with Countdown Timer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-orange-600 via-rose-600 to-red-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-black uppercase tracking-wider backdrop-blur-xs">
                <Zap className="w-3.5 h-3.5 fill-current" /> Limited Time Deals
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Flash Deals – Save Up to 35%
              </h2>
              <p className="text-xs sm:text-sm text-orange-100 max-w-lg">
                Exclusive daily price cuts on top selling electronics, smart devices, and fashion gear.
              </p>
            </div>

            {/* Live Countdown Timer */}
            <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md p-3 rounded-2xl border border-white/20">
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
        </div>

        {/* Deals Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {dealProducts.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      {/* 4. Promotional Split Banners */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Banner 1 */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 flex flex-col justify-between min-h-[260px] shadow-lg group">
            <img
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02560?w=800&auto=format&fit=crop&q=80"
              alt="Flagship smartphones"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="relative z-10 space-y-2 max-w-sm">
              <span className="text-xs font-extrabold uppercase text-orange-400 tracking-wider">
                Next-Gen Mobile Tech
              </span>
              <h3 className="text-2xl font-black text-white leading-tight">
                Flagship Smartphones & 65W GaN Fast Chargers
              </h3>
              <p className="text-xs text-slate-300">
                Starting at just $24.99 with free express shipping.
              </p>
            </div>
            <div className="relative z-10 pt-4">
              <button
                onClick={() => onNavigate('/shop?category=mobiles')}
                className="px-5 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-xs hover:bg-slate-100 transition-colors inline-flex items-center gap-1.5"
              >
                Shop Mobiles <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Banner 2 */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 flex flex-col justify-between min-h-[260px] shadow-lg group">
            <img
              src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80"
              alt="Home & Kitchen Appliances"
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="relative z-10 space-y-2 max-w-sm">
              <span className="text-xs font-extrabold uppercase text-blue-400 tracking-wider">
                Home Innovations
              </span>
              <h3 className="text-2xl font-black text-white leading-tight">
                Espresso Makers & Smart LiDAR Robotic Vacuums
              </h3>
              <p className="text-xs text-slate-300">
                Upgrade your modern living space with up to 30% savings.
              </p>
            </div>
            <div className="relative z-10 pt-4">
              <button
                onClick={() => onNavigate('/shop?category=home-kitchen')}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
              >
                Shop Home & Kitchen <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Products & Bestsellers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 uppercase tracking-wider mb-1">
              <TrendingUp className="w-3.5 h-3.5" /> Highly Rated
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Featured Products & Bestsellers
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/shop')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featuredProducts.slice(0, 8).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={onQuickView}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      </section>

      {/* 6. Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
            Real Customer Feedback
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
            Loved by Thousands of Shoppers
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <Quote className="w-8 h-8 text-blue-100 absolute top-5 right-5" />
              <div>
                <div className="flex items-center gap-1 mb-3">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mb-4 italic">
                  "{item.comment}"
                </p>
                <div className="text-[11px] font-semibold text-blue-600 mb-4">
                  Purchased: {item.product}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-10 h-10 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <h4 className="font-bold text-xs text-slate-900">{item.name}</h4>
                  <p className="text-[11px] text-slate-400">{item.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

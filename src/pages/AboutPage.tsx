import React from 'react';
import { ShoppingCart, ShieldCheck, Truck, Users, Award, HeartHandshake } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
          Our Story & Vision
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          Redefining E-Commerce with Speed, Quality & Care.
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Founded with a commitment to making premium online shopping seamless and dependable, QuickMart brings you everything you need—from cutting-edge technology to everyday essentials—just a single click away.
        </p>
      </div>

      {/* Image Showcase */}
      <div className="aspect-video w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200">
        <img
          src="https://images.unsplash.com/photo-1556742049-0a67c5574f73?w=1200&auto=format&fit=crop&q=80"
          alt="QuickMart fulfillment operations"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Core Values */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Truck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Swift Doorstep Delivery</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our optimized fulfillment warehouses ensure express turnarounds so your orders arrive right when you need them.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">100% Authentic Quality</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every product catalogued undergoes rigorous authenticity audits and comes with direct manufacturer warranty guarantees.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Customer-First Ethos</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            30-day effortless returns, friendly 24/7 support specialists, and safe bank-grade payment security on every checkout.
          </p>
        </div>
      </div>

      {/* Stats Banner */}
      <div className="bg-slate-900 rounded-3xl p-8 text-white grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        <div>
          <div className="text-3xl font-black text-blue-400">50K+</div>
          <div className="text-xs text-slate-400 mt-1">Happy Customers</div>
        </div>
        <div>
          <div className="text-3xl font-black text-orange-400">10,000+</div>
          <div className="text-xs text-slate-400 mt-1">Curated Products</div>
        </div>
        <div>
          <div className="text-3xl font-black text-emerald-400">99.8%</div>
          <div className="text-xs text-slate-400 mt-1">On-Time Deliveries</div>
        </div>
        <div>
          <div className="text-3xl font-black text-purple-400">4.9/5</div>
          <div className="text-xs text-slate-400 mt-1">Average Satisfaction</div>
        </div>
      </div>
    </div>
  );
};

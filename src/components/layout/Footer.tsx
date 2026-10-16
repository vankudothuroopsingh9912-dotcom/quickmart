import React, { useState } from 'react';
import {
  ShoppingCart,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Truck,
  RotateCcw,
  Headphones,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { showToast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    setIsSubscribed(true);
    showToast('You have been subscribed to QuickMart VIP deals!', 'success', 'Subscribed');
    setEmail('');
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      {/* 1. Value Proposition Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 pb-12 border-b border-slate-800">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">Free Express Delivery</h5>
              <p className="text-xs text-slate-400 mt-0.5">On all qualified orders over $75</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">100% Secure Checkout</h5>
              <p className="text-xs text-slate-400 mt-0.5">Razorpay & SSL encrypted payments</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">30-Day Hassle-Free Returns</h5>
              <p className="text-xs text-slate-400 mt-0.5">Prepaid return labels & instant refunds</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">24/7 Dedicated Support</h5>
              <p className="text-xs text-slate-400 mt-0.5">Live assistance whenever you need it</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <div
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2.5 cursor-pointer inline-flex"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center text-2xl font-black text-white tracking-tight">
                Quick<span className="text-orange-500">Mart</span>
              </div>
            </div>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Everything You Need, Just a Click Away. Discover thousands of handpicked electronics, fashion apparel, home appliances, and daily essentials backed by fast shipping and trusted customer service.
            </p>

            <div className="space-y-2 text-xs text-slate-400 pt-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                <span>100 Innovation Way, Suite 500, San Francisco, CA 94105</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+1 (800) 555-MART (Toll-Free)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>support@quickmart.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/shop')} className="hover:text-white transition-colors">
                  Shop All Products
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/categories')} className="hover:text-white transition-colors">
                  Product Categories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/deals')} className="hover:text-orange-400 font-semibold transition-colors">
                  Flash Deals & Coupons
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/track')} className="hover:text-white transition-colors">
                  Track Deliveries
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/cart')} className="hover:text-white transition-colors">
                  Shopping Cart
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/wishlist')} className="hover:text-white transition-colors">
                  Saved Wishlist
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Policies */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">
                  About QuickMart
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors">
                  Contact Us
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/faq')} className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/policies')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/policies')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/policies')} className="hover:text-white transition-colors">
                  Return & Refund Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Stay Connected</h4>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Subscribe to receive weekly flash sales, coupon codes, and new product announcements.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-blue-500 placeholder-slate-500"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center transition-colors"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
              {isSubscribed && (
                <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" /> You're on the VIP list!
                </div>
              )}
            </form>
          </div>
        </div>

        {/* 3. Bottom Bar: Payments & Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; 2026 QuickMart Inc. All rights reserved. Built with pride for seamless online shopping.
          </div>

          {/* Payment Methods */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[11px] text-slate-400 mr-1">Accepted Payments:</span>
            {['Razorpay', 'Visa', 'Mastercard', 'UPI', 'Cash On Delivery'].map((method) => (
              <span
                key={method}
                className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-medium text-slate-300 border border-slate-700"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

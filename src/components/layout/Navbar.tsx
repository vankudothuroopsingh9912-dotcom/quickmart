import React, { useState, useEffect, useRef } from 'react';
import {
  ShoppingCart,
  Heart,
  User as UserIcon,
  Search,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Truck,
  ShieldCheck,
  LogOut,
  Package,
  Layers,
  ArrowRight,
  Flame,
  LayoutDashboard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { productAPI, categoryAPI } from '../../services/api';
import { Category } from '../../types';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenQuickView?: (product: any) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPath, onNavigate }) => {
  const { user, isAdmin, logout, loginAsDemoCustomer, loginAsDemoAdmin } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();

  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Fetch categories for navbar
  useEffect(() => {
    categoryAPI.getCategories().then(res => {
      if (res.success) {
        setCategories(res.categories);
      }
    }).catch(() => {});
  }, []);

  // Live search suggestions debounce
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(() => {
      productAPI.getSearchSuggestions(searchTerm).then(res => {
        if (res.success) {
          setSuggestions(res.suggestions);
        }
      }).catch(() => {});
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Click outside listener for dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setIsSearchFocused(false);
      onNavigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Shop All', path: '/shop' },
    { label: 'Categories', path: '/categories' },
    { label: 'Deals & Offers', path: '/deals', badge: 'Hot', isHot: true },
    { label: 'Track Order', path: '/track' },
    { label: 'Contact', path: '/contact' },
    { label: 'FAQ', path: '/faq' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white shadow-xs border-b border-slate-200">
      {/* 1. Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="bg-orange-500 text-white font-black text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider">
              Special
            </span>
            <span className="hidden sm:inline font-medium">
              Free Express Shipping on orders over $75! Use code <strong className="underline font-bold">SUPER20</strong> for 20% off $100+.
            </span>
            <span className="sm:hidden font-medium">Use code SUPER20 for 20% off!</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] opacity-90">
            <button
              onClick={() => onNavigate('/track')}
              className="hover:underline flex items-center gap-1"
            >
              <Truck className="w-3.5 h-3.5" /> Track Order
            </button>
            <span className="opacity-40">|</span>
            <button
              onClick={() => onNavigate('/about')}
              className="hover:underline hidden md:inline"
            >
              About QuickMart
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => onNavigate('/')}
          className="flex items-center gap-2.5 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-blue-600 group-hover:bg-blue-700 transition-colors flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <ShoppingCart className="w-5 h-5 text-white transform group-hover:rotate-6 transition-transform" />
          </div>
          <div>
            <div className="flex items-center">
              <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Quick</span>
              <span className="text-xl sm:text-2xl font-black text-orange-500 tracking-tight">Mart</span>
            </div>
            <p className="text-[10px] font-medium text-slate-400 -mt-1 hidden sm:block">
              Everything You Need
            </p>
          </div>
        </div>

        {/* Live Search Bar with Instant Autocomplete */}
        <div ref={searchRef} className="relative flex-1 max-w-xl hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder="Search products, brands, or categories..."
              className="w-full pl-10 pr-24 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-full focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-full transition-colors flex items-center gap-1 shadow-xs"
            >
              Search
            </button>
          </form>

          {/* Autocomplete Suggestions Box */}
          {isSearchFocused && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
              <div className="p-2 border-b border-slate-100 flex items-center justify-between text-xs text-slate-400 px-3 font-medium">
                <span>Matching Products</span>
                <span>Press Enter to view all</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {suggestions.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setIsSearchFocused(false);
                      setSearchTerm('');
                      onNavigate(`/product/${item.id}`);
                    }}
                    className="p-3 hover:bg-slate-50 flex items-center gap-3 cursor-pointer transition-colors"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg border border-slate-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-slate-900 truncate">{item.name}</h4>
                      <p className="text-[11px] text-slate-400">
                        {item.brand} • <span className="capitalize">{item.category.replace('-', ' ')}</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900">${item.price.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Action Icons: Account, Wishlist, Cart */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Account Menu */}
          <div ref={userMenuRef} className="relative">
            {user ? (
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                  alt={user.name}
                  className="w-8 h-8 rounded-full border border-blue-200 object-cover"
                />
                <span className="text-xs font-semibold text-slate-700 hidden lg:inline max-w-[100px] truncate">
                  {user.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden lg:inline" />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('/login')}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 rounded-xl hover:bg-slate-50 transition-colors"
              >
                <UserIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Sign In</span>
              </button>
            )}

            {/* User Dropdown Menu */}
            {isUserMenuOpen && user && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-fadeIn">
                <div className="px-4 py-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                    {user.role === 'admin' ? (
                      <span className="bg-purple-100 text-purple-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded">
                        Admin
                      </span>
                    ) : (
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Customer
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-0.5">{user.email}</p>
                </div>

                <div className="py-1">
                  {isAdmin && (
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onNavigate('/admin');
                      }}
                      className="w-full px-4 py-2 text-left text-xs font-semibold text-purple-700 hover:bg-purple-50 flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4 text-purple-600" /> Admin Dashboard
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate('/profile');
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-slate-400" /> Profile & Addresses
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate('/my-orders');
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Package className="w-4 h-4 text-slate-400" /> My Orders & Tracking
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onNavigate('/wishlist');
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4 text-slate-400" /> Saved Wishlist
                  </button>
                </div>

                {/* Quick Account Switcher for Demo testing */}
                <div className="p-3 border-t border-slate-100 bg-slate-50">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                    Switch Test Account
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={async () => {
                        await loginAsDemoCustomer();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex-1 py-1 text-[11px] font-medium bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Customer
                    </button>
                    <button
                      onClick={async () => {
                        await loginAsDemoAdmin();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex-1 py-1 text-[11px] font-medium bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-purple-50 hover:text-purple-600 transition-colors"
                    >
                      Admin
                    </button>
                  </div>
                </div>

                <div className="p-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-xs font-medium text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Wishlist Link */}
          <button
            type="button"
            onClick={() => onNavigate('/wishlist')}
            title="Wishlist"
            className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-700 hover:text-rose-600 transition-colors"
          >
            <Heart className="w-5 h-5" />
            {wishlistCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Link */}
          <button
            type="button"
            onClick={() => onNavigate('/cart')}
            title="Shopping Cart"
            className="relative p-2.5 rounded-full hover:bg-slate-100 text-slate-700 hover:text-blue-600 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {itemCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-orange-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                {itemCount}
              </span>
            )}
          </button>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-xl"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* 3. Secondary Navigation (Category bar) */}
      <nav className="bg-slate-50 border-t border-slate-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-1 py-1.5">
            {navLinks.map((link) => {
              const isActive = currentPath === link.path || (link.path !== '/' && currentPath.startsWith(link.path));
              return (
                <button
                  key={link.path}
                  onClick={() => onNavigate(link.path)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-200/60 hover:text-blue-600'
                  }`}
                >
                  {link.isHot && <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />}
                  {link.label}
                  {link.badge && (
                    <span className={`text-[10px] px-1 py-0.2 rounded font-extrabold ${isActive ? 'bg-white text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> 100% Genuine Products
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 p-4 space-y-4 animate-fadeIn">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          {/* Links */}
          <div className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate(link.path);
                }}
                className="py-2.5 px-3 text-left font-medium text-sm text-slate-800 hover:bg-slate-50 rounded-lg flex items-center justify-between"
              >
                <span className="flex items-center gap-2">
                  {link.isHot && <Flame className="w-4 h-4 text-orange-500" />}
                  {link.label}
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('/admin');
                }}
                className="py-2.5 px-3 text-left font-bold text-sm text-purple-700 bg-purple-50 rounded-lg flex items-center justify-between"
              >
                <span>Admin Console</span>
                <ArrowRight className="w-4 h-4 text-purple-400" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

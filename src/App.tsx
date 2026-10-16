import React, { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { CompareProvider, useCompare } from './context/CompareContext';
import { RecentlyViewedProvider } from './context/RecentlyViewedContext';

import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { CompareModal } from './components/common/CompareModal';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { DealsPage } from './pages/DealsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { OrdersHistoryPage } from './pages/OrdersHistoryPage';
import { WishlistPage } from './pages/WishlistPage';
import { ProfilePage } from './pages/ProfilePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { PoliciesPage } from './pages/PoliciesPage';
import { AdminConsole } from './pages/admin/AdminConsole';
import { NotFoundPage } from './pages/NotFoundPage';
import { Product, Order } from './types';

function AppContent() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname + window.location.search || '/';
  });

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);
  const { openCompareModal, comparedProducts } = useCompare();

  // Listen for browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname + window.location.search || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Parse path and query
  const [pathname, searchString] = currentPath.split('?');
  const queryParams = new URLSearchParams(searchString || '');

  // Dynamic route matcher
  let pageComponent = <NotFoundPage onNavigate={navigate} />;

  if (pathname === '/' || pathname === '') {
    pageComponent = <HomePage onNavigate={navigate} onQuickView={setQuickViewProduct} />;
  } else if (pathname === '/shop') {
    pageComponent = (
      <ShopPage
        initialCategory={queryParams.get('category') || undefined}
        initialSearch={queryParams.get('search') || undefined}
        onNavigate={navigate}
        onQuickView={setQuickViewProduct}
      />
    );
  } else if (pathname === '/categories') {
    pageComponent = <CategoriesPage onNavigate={navigate} />;
  } else if (pathname.startsWith('/product/')) {
    const productId = pathname.replace('/product/', '');
    pageComponent = (
      <ProductDetailsPage
        productId={productId}
        onNavigate={navigate}
        onQuickView={setQuickViewProduct}
      />
    );
  } else if (pathname === '/deals') {
    pageComponent = <DealsPage onNavigate={navigate} onQuickView={setQuickViewProduct} />;
  } else if (pathname === '/cart') {
    pageComponent = <CartPage onNavigate={navigate} />;
  } else if (pathname === '/checkout') {
    pageComponent = <CheckoutPage onNavigate={navigate} onOrderPlaced={setLastPlacedOrder} />;
  } else if (pathname.startsWith('/order-success')) {
    pageComponent = <OrderSuccessPage order={lastPlacedOrder} onNavigate={navigate} />;
  } else if (pathname.startsWith('/track')) {
    const trackingArg = pathname.replace('/track', '').replace('/', '') || queryParams.get('id') || undefined;
    pageComponent = <OrderTrackingPage orderIdOrTracking={trackingArg} onNavigate={navigate} />;
  } else if (pathname === '/my-orders') {
    pageComponent = <OrdersHistoryPage onNavigate={navigate} />;
  } else if (pathname === '/wishlist') {
    pageComponent = <WishlistPage onNavigate={navigate} onQuickView={setQuickViewProduct} />;
  } else if (pathname === '/profile') {
    pageComponent = <ProfilePage onNavigate={navigate} />;
  } else if (pathname === '/login') {
    pageComponent = <LoginPage onNavigate={navigate} />;
  } else if (pathname === '/register') {
    pageComponent = <RegisterPage onNavigate={navigate} />;
  } else if (pathname === '/forgot-password') {
    pageComponent = <ForgotPasswordPage onNavigate={navigate} />;
  } else if (pathname === '/about') {
    pageComponent = <AboutPage onNavigate={navigate} />;
  } else if (pathname === '/contact') {
    pageComponent = <ContactPage onNavigate={navigate} />;
  } else if (pathname === '/faq') {
    pageComponent = <FaqPage onNavigate={navigate} />;
  } else if (pathname === '/policies') {
    pageComponent = <PoliciesPage />;
  } else if (pathname === '/admin') {
    pageComponent = <AdminConsole onNavigate={navigate} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar currentPath={currentPath} onNavigate={navigate} />

      <main className="flex-1">
        {pageComponent}
      </main>

      <Footer onNavigate={navigate} />

      {/* Modals */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onNavigate={navigate}
      />

      <CompareModal onNavigate={navigate} />

      {/* Floating Compare button indicator if products are being compared */}
      {comparedProducts.length > 0 && (
        <button
          onClick={openCompareModal}
          className="fixed bottom-6 left-6 z-40 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold hover:bg-slate-800 transition-all border border-slate-700 hover:scale-105"
        >
          <span className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px]">
            {comparedProducts.length}
          </span>
          Compare Products
        </button>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              <RecentlyViewedProvider>
                <AppContent />
              </RecentlyViewedProvider>
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

import React, { useState, useEffect } from 'react';
import { Package, Truck, ArrowRight, Printer, AlertCircle } from 'lucide-react';
import { orderAPI } from '../services/api';
import { Order } from '../types';
import { useAuth } from '../context/AuthContext';

interface OrdersHistoryPageProps {
  onNavigate: (path: string) => void;
}

export const OrdersHistoryPage: React.FC<OrdersHistoryPageProps> = ({ onNavigate }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      orderAPI.getMyOrders()
        .then(res => {
          if (res.success) setOrders(res.orders);
        })
        .catch(err => console.error('Failed to load user orders:', err))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-blue-600 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900">Sign In to View Orders</h2>
        <p className="text-xs text-slate-500">Please sign in to access your order history and track shipments.</p>
        <button
          onClick={() => onNavigate('/login')}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-semibold"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Orders History
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review past purchases, download invoices, and track live deliveries.
        </p>
      </div>

      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-xs text-slate-400">Loading your orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4">
          <Package className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">No Orders Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You haven't placed any orders yet. Discover our latest deals and top products!
          </p>
          <button
            onClick={() => onNavigate('/shop')}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-sm"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs hover:border-blue-300 transition-colors"
            >
              {/* Header info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-sm text-slate-900 font-mono">#{order.id}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'Cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                  <span>Placed: {new Date(order.createdAt).toLocaleDateString()}</span>
                  <span>Total: <strong className="text-slate-900 font-bold">${order.total.toFixed(2)}</strong></span>
                </div>
              </div>

              {/* Items */}
              <div className="divide-y divide-slate-100">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-xl border border-slate-200" />
                      <div>
                        <h4 className="font-semibold text-slate-900">{item.name}</h4>
                        <p className="text-[11px] text-slate-400">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                    <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Footer bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="text-slate-500">
                  Tracking: <span className="font-mono text-blue-600 font-semibold">{order.trackingNumber}</span> ({order.carrier})
                </div>

                <button
                  onClick={() => onNavigate(`/track/${order.id}`)}
                  className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Truck className="w-3.5 h-3.5" /> Track & View Invoice &rarr;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

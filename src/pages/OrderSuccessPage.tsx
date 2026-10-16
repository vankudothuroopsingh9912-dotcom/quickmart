import React from 'react';
import { CheckCircle2, Truck, Package, ArrowRight, Printer } from 'lucide-react';
import { Order } from '../types';

interface OrderSuccessPageProps {
  order: Order | null;
  onNavigate: (path: string) => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({ order, onNavigate }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-8">
      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">
          Payment & Order Confirmed
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Thank You for Shopping at QuickMart!
        </h1>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          We have received your order and dispatched confirmation details to your registered email address.
        </p>
      </div>

      {order && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6 text-left shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-6 border-b border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 block">Order Number</span>
              <strong className="text-slate-900 font-mono text-sm">#{order.id}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Tracking Number</span>
              <strong className="text-blue-600 font-mono text-sm">{order.trackingNumber}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Total Paid</span>
              <strong className="text-slate-900 text-sm">${order.total.toFixed(2)}</strong>
            </div>
            <div>
              <span className="text-slate-400 block">Est. Delivery</span>
              <strong className="text-slate-900 text-sm">{order.estimatedDelivery}</strong>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Ordered Items</h4>
            <div className="divide-y divide-slate-100">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                    <div>
                      <p className="font-semibold text-slate-900">{item.name}</p>
                      <p className="text-slate-400 text-[11px]">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4">
        {order && (
          <button
            onClick={() => onNavigate(`/track/${order.id}`)}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-2"
          >
            <Truck className="w-4 h-4" /> Track Real-Time Delivery
          </button>
        )}

        <button
          onClick={() => onNavigate('/shop')}
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

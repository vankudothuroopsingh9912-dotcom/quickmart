import React, { useState, useEffect } from 'react';
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  Printer,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Search,
  MapPin,
  Calendar
} from 'lucide-react';
import { Order } from '../types';
import { orderAPI } from '../services/api';
import { useToast } from '../context/ToastContext';

interface OrderTrackingPageProps {
  orderIdOrTracking?: string;
  onNavigate: (path: string) => void;
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({
  orderIdOrTracking,
  onNavigate
}) => {
  const [queryInput, setQueryInput] = useState(orderIdOrTracking || '');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [returnReason, setReturnReason] = useState('');
  const [showReturnModal, setShowReturnModal] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (orderIdOrTracking) {
      loadOrder(orderIdOrTracking);
    }
  }, [orderIdOrTracking]);

  const loadOrder = async (id: string) => {
    setLoading(true);
    setNotFound(false);
    try {
      const res = await orderAPI.getOrderById(id.trim());
      if (res.success && res.order) {
        setOrder(res.order);
      } else {
        setNotFound(true);
        setOrder(null);
      }
    } catch {
      setNotFound(true);
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    loadOrder(queryInput.trim());
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    if (!confirm('Are you sure you wish to cancel this order?')) return;

    try {
      const res = await orderAPI.cancelOrder(order.id);
      if (res.success) {
        setOrder(res.order);
        showToast('Your order has been cancelled.', 'info', 'Order Cancelled');
      }
    } catch (err: any) {
      showToast(err.message || 'Cannot cancel order.', 'error');
    }
  };

  const handleRequestReturn = async () => {
    if (!order) return;
    if (!returnReason.trim()) {
      showToast('Please describe the reason for return.', 'warning');
      return;
    }

    try {
      const res = await orderAPI.requestReturn(order.id, returnReason);
      if (res.success) {
        setOrder(res.order);
        setShowReturnModal(false);
        showToast('Return request recorded. A prepaid return waybill is prepared.', 'success', 'Return Authorized');
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to submit return request.', 'error');
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  const statusList = [
    'Order Placed',
    'Confirmed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];

  const getCurrentStatusIndex = (currentStatus: string) => {
    return statusList.indexOf(currentStatus);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header Bar (no-print) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs no-print">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Track Your Package</h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter your QuickMart Order ID (e.g. ORD-98214) or Tracking Number (e.g. QM-EXP-8891024)
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="ORD-XXXXX or QM-XXX-XXXX"
              className="px-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono w-full md:w-64"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shrink-0"
            >
              {loading ? 'Searching...' : 'Track'}
            </button>
          </form>
        </div>
      </div>

      {notFound && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 no-print">
          <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Order Not Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            We couldn't locate an order with number "{queryInput}". Please double check your order confirmation email or sign in to view your orders.
          </p>
          <button
            onClick={() => onNavigate('/my-orders')}
            className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
          >
            View My Orders History
          </button>
        </div>
      )}

      {order && (
        <div className="space-y-6">
          {/* Printable Invoice & Order Details Container */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-8 shadow-xs">
            {/* Order Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-black text-slate-900">Order #{order.id}</h2>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                      order.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.status === 'Cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : order.status === 'Return Requested'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500">
                  Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>

              {/* Action Buttons (Print Invoice / Cancel / Return) */}
              <div className="flex items-center gap-2 no-print">
                <button
                  onClick={handlePrintInvoice}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-4 h-4" /> Print Invoice
                </button>

                {order.canCancel && !['Shipped', 'Delivered', 'Cancelled'].includes(order.status) && (
                  <button
                    onClick={handleCancelOrder}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-semibold transition-colors"
                  >
                    Cancel Order
                  </button>
                )}

                {order.status === 'Delivered' && (
                  <button
                    onClick={() => setShowReturnModal(true)}
                    className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Request Return
                  </button>
                )}
              </div>
            </div>

            {/* Shipment Progress Timeline Bar */}
            {order.status !== 'Cancelled' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-slate-900">
                      Carrier: {order.carrier} (Waybill: <span className="font-mono text-blue-600">{order.trackingNumber}</span>)
                    </span>
                  </div>
                  <span className="text-slate-500">
                    Estimated Delivery: <strong>{order.estimatedDelivery}</strong>
                  </span>
                </div>

                {/* Stepper Dots & Line */}
                <div className="relative pt-4 pb-2">
                  <div className="grid grid-cols-6 gap-2 text-center">
                    {statusList.map((stepName, idx) => {
                      const currentIndex = getCurrentStatusIndex(order.status);
                      const isComplete = currentIndex >= idx;
                      const isCurrent = currentIndex === idx;

                      return (
                        <div key={stepName} className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all ${
                              isComplete
                                ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                                : 'bg-slate-100 text-slate-400'
                            }`}
                          >
                            {isComplete ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                          </div>
                          <span
                            className={`text-[11px] leading-tight ${
                              isCurrent
                                ? 'font-black text-blue-700'
                                : isComplete
                                ? 'font-semibold text-slate-800'
                                : 'text-slate-400'
                            }`}
                          >
                            {stepName}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Detailed Timeline Events Log */}
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200/80 space-y-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" /> Tracking Event History
              </h4>
              <div className="space-y-3">
                {order.timeline.map((ev, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600 mt-1 shrink-0" />
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <span className="font-bold text-slate-900">{ev.status}</span>
                        <span className="text-slate-400 text-[11px]">{ev.date}</span>
                      </div>
                      <p className="text-slate-600 mt-0.5">{ev.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Items Summary & Pricing Table */}
            <div className="space-y-4">
              <h4 className="font-bold text-sm text-slate-900">Ordered Items</h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden">
                {order.items.map((item, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between gap-4 bg-white">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-xl border border-slate-200" />
                      <div>
                        <h5 className="font-bold text-xs text-slate-900">{item.name}</h5>
                        {item.selectedVariants && (
                          <p className="text-[11px] text-slate-400">
                            {Object.entries(item.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')}
                          </p>
                        )}
                        <span className="text-xs text-slate-500">Qty: {item.quantity} × ${item.price.toFixed(2)}</span>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-slate-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Financials Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-200 text-xs">
              <div>
                <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-2">Delivery Address</h5>
                <p className="font-semibold text-slate-800">{order.shippingAddress.fullName}</p>
                <p className="text-slate-600">{order.shippingAddress.street}</p>
                <p className="text-slate-600">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
                </p>
                <p className="text-slate-600">{order.shippingAddress.country}</p>
                <p className="text-slate-500 mt-1">Contact: {order.customerPhone || order.shippingAddress.phone}</p>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <h5 className="font-bold text-slate-900 uppercase tracking-wider mb-1">Payment Method</h5>
                  <p className="text-slate-700">
                    {order.paymentMethod === 'Razorpay' ? 'Razorpay Online Gateway' : 'Cash on Delivery'}
                    <span className={`ml-2 px-2 py-0.5 rounded text-[10px] font-bold ${
                      order.paymentStatus === 'Paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </p>
                  {order.paymentTransactionId && (
                    <p className="font-mono text-[10px] text-slate-400 mt-0.5">Ref: {order.paymentTransactionId}</p>
                  )}
                </div>
              </div>

              {/* Financial summary */}
              <div className="space-y-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-900">${order.subtotal.toFixed(2)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                    <span>-${order.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping ({order.shippingMethod})</span>
                  <span className="font-semibold text-slate-900">
                    {order.shippingFee === 0 ? 'FREE' : `$${order.shippingFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span className="font-semibold text-slate-900">${order.tax.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm">
                  <span className="font-bold text-slate-900">Total Paid</span>
                  <span className="text-lg font-black text-slate-900">${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Return Request Modal */}
      {showReturnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Request Item Return</h3>
            <p className="text-xs text-slate-500">
              Please let us know why you would like to return this order. QuickMart offers 30-day free returns with prepaid return postage.
            </p>

            <textarea
              rows={4}
              value={returnReason}
              onChange={(e) => setReturnReason(e.target.value)}
              placeholder="e.g. Size didn't fit, wrong color, changed mind..."
              className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReturnModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRequestReturn}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold"
              >
                Submit Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

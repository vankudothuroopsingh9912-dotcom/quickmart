import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  Plus,
  MapPin,
  Tag,
  Building,
  Smartphone
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { orderAPI } from '../services/api';
import { Address, Order } from '../types';
import { RazorpayModal } from '../components/common/RazorpayModal';

interface CheckoutPageProps {
  onNavigate: (path: string) => void;
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate, onOrderPlaced }) => {
  const { items, subtotal, discountAmount, coupon, shippingFee, tax, total, clearCart } = useCart();
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const [step, setStep] = useState<number>(1);
  const [shippingMethod, setShippingMethod] = useState<'Standard' | 'Express'>('Standard');
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'COD'>('Razorpay');
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Address selection & form
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [isAddingNewAddress, setIsAddingNewAddress] = useState<boolean>(false);
  const [newAddress, setNewAddress] = useState({
    fullName: user?.name || '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: user?.phone || ''
  });

  // Razorpay test modal
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string>('');

  useEffect(() => {
    if (items.length === 0) {
      onNavigate('/cart');
    }
  }, [items, onNavigate]);

  useEffect(() => {
    if (user && user.addresses && user.addresses.length > 0) {
      const defaultAddr = user.addresses.find(a => a.isDefault) || user.addresses[0];
      setSelectedAddressId(defaultAddr.id);
    } else {
      setIsAddingNewAddress(true);
    }
  }, [user]);

  const activeShippingFee = shippingMethod === 'Express' ? 14.99 : shippingFee;
  const grandTotal = Number((subtotal - discountAmount + activeShippingFee + tax).toFixed(2));

  const getResolvedAddress = (): Address | null => {
    if (isAddingNewAddress || !user?.addresses?.length) {
      if (!newAddress.fullName || !newAddress.street || !newAddress.city || !newAddress.postalCode) {
        return null;
      }
      return {
        id: `addr-temp-${Date.now()}`,
        fullName: newAddress.fullName,
        street: newAddress.street,
        city: newAddress.city,
        state: newAddress.state,
        postalCode: newAddress.postalCode,
        country: newAddress.country,
        phone: newAddress.phone,
        isDefault: false
      };
    } else {
      return user.addresses.find(a => a.id === selectedAddressId) || null;
    }
  };

  const handleCreateOrder = async () => {
    const shippingAddress = getResolvedAddress();
    if (!shippingAddress) {
      showToast('Please fill in complete delivery address details.', 'warning');
      setStep(1);
      return;
    }

    if (!user) {
      showToast('Please log in or sign up to finalize your order.', 'warning');
      onNavigate('/login');
      return;
    }

    setIsPlacingOrder(true);

    try {
      const payload = {
        items,
        shippingAddress,
        paymentMethod,
        shippingMethod,
        couponCode: coupon?.code,
        paymentTransactionId: paymentMethod === 'COD' ? undefined : undefined
      };

      const res = await orderAPI.createOrder(payload);

      if (res.success && res.order) {
        if (paymentMethod === 'Razorpay') {
          // Open simulated Razorpay test mode payment modal
          setPendingOrderId(res.order.id);
          setIsRazorpayModalOpen(true);
          setIsPlacingOrder(false);
        } else {
          // Cash On Delivery placed directly
          clearCart();
          confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          showToast('Order confirmed via Cash on Delivery!', 'success', 'Order Placed');
          onOrderPlaced(res.order);
          onNavigate(`/order-success/${res.order.id}`);
        }
      }
    } catch (err: any) {
      showToast(err.message || 'Failed to complete order. Please check stock.', 'error');
      setIsPlacingOrder(false);
    }
  };

  const handleRazorpaySuccess = async (paymentId: string) => {
    setIsRazorpayModalOpen(false);
    try {
      const res = await orderAPI.verifyPayment(pendingOrderId, paymentId);
      if (res.success) {
        clearCart();
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
        showToast('Payment verified successfully via Razorpay test gateway!', 'success', 'Payment Received');
        onOrderPlaced(res.order);
        onNavigate(`/order-success/${res.order.id}`);
      }
    } catch (err: any) {
      showToast('Payment verification failed.', 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Step Tracker */}
      <div className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review shipping address, select payment method, and complete your purchase.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Multi-Step Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Step 1: Delivery Address */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h3 className="font-bold text-slate-900 text-base">Delivery Address</h3>
              </div>
              {user?.addresses && user.addresses.length > 0 && (
                <button
                  type="button"
                  onClick={() => setIsAddingNewAddress(!isAddingNewAddress)}
                  className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {isAddingNewAddress ? 'Use Saved Address' : 'Add New Address'}
                </button>
              )}
            </div>

            {/* Saved address selector */}
            {!isAddingNewAddress && user?.addresses && user.addresses.length > 0 ? (
              <div className="space-y-3">
                {user.addresses.map((addr) => (
                  <label
                    key={addr.id}
                    onClick={() => setSelectedAddressId(addr.id)}
                    className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs text-slate-900">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-semibold">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600">
                          {addr.street}, {addr.city}, {addr.state} {addr.postalCode}, {addr.country}
                        </p>
                        <p className="text-xs text-slate-500">Phone: {addr.phone}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        selectedAddressId === addr.id ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                      }`}>
                        {selectedAddressId === addr.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              /* New Address Input Form */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={newAddress.fullName}
                    onChange={(e) => setNewAddress({ ...newAddress, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="Recipient's Name"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    value={newAddress.street}
                    onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="House number, apartment, suite, unit"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={newAddress.city}
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="City"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="CA / NY / etc."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Postal / ZIP Code</label>
                  <input
                    type="text"
                    value={newAddress.postalCode}
                    onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="e.g. 94107"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={newAddress.phone}
                    onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Shipping Method */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base">Shipping Options</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label
                onClick={() => setShippingMethod('Standard')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  shippingMethod === 'Standard'
                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-blue-600" />
                    <span className="font-bold text-xs text-slate-900">Standard Delivery</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">
                    {subtotal >= 75 ? 'FREE' : '$7.99'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Delivered within 3 to 5 business days.</p>
              </label>

              <label
                onClick={() => setShippingMethod('Express')}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  shippingMethod === 'Express'
                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-orange-500" />
                    <span className="font-bold text-xs text-slate-900">Priority Express</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">$14.99</span>
                </div>
                <p className="text-[11px] text-slate-500">Dispatched priority with 1 to 2 business day delivery.</p>
              </label>
            </div>
          </div>

          {/* Step 3: Payment Method Selection */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base">Payment Method</h3>
            </div>

            <div className="space-y-3">
              {/* Razorpay Option */}
              <label
                onClick={() => setPaymentMethod('Razorpay')}
                className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'Razorpay'
                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                      R
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-900">Razorpay Online Gateway</span>
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                          Instant Test Mode
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">Cards, UPI (GPay/PhonePe), NetBanking & Wallets</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'Razorpay' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'Razorpay' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </label>

              {/* Cash On Delivery Option */}
              <label
                onClick={() => setPaymentMethod('COD')}
                className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                  paymentMethod === 'COD'
                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-800 text-white flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-xs text-slate-900">Cash on Delivery (COD)</span>
                      <p className="text-[11px] text-slate-500">Pay cash upon package arrival at your doorstep</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    paymentMethod === 'COD' ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                  }`}>
                    {paymentMethod === 'COD' && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Place Order Button */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-5 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Review Items ({items.length})
            </h3>

            {/* Item Thumbnails mini list */}
            <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.id} className="flex items-center gap-3 text-xs">
                  <img src={it.image} alt={it.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 truncate">{it.name}</p>
                    <p className="text-[11px] text-slate-500">Qty: {it.quantity} × ${it.price.toFixed(2)}</p>
                  </div>
                  <span className="font-bold text-slate-900">${(it.price * it.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Financials */}
            <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-semibold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({coupon?.code})</span>
                  <span>-${discountAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Shipping ({shippingMethod})</span>
                <span className="font-semibold text-slate-900">
                  {activeShippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${activeShippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Tax (8%)</span>
                <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-base">
                <span className="font-bold text-slate-900">Grand Total</span>
                <span className="text-2xl font-black text-slate-900">${grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Place Order CTA */}
            <button
              type="button"
              disabled={isPlacingOrder}
              onClick={handleCreateOrder}
              className="w-full py-4 px-6 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isPlacingOrder ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Authorizing Order...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" /> Place Order (${grandTotal.toFixed(2)})
                </>
              )}
            </button>

            <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>SSL Bank-Grade Encryption</span>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Test Gateway Modal */}
      <RazorpayModal
        isOpen={isRazorpayModalOpen}
        amount={grandTotal}
        customerName={user?.name || newAddress.fullName}
        customerEmail={user?.email || 'customer@quickmart.com'}
        orderId={pendingOrderId}
        onSuccess={handleRazorpaySuccess}
        onClose={() => setIsRazorpayModalOpen(false)}
      />
    </div>
  );
};

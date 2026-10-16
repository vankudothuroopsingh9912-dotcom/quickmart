import React, { useState } from 'react';
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  X
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

interface CartPageProps {
  onNavigate: (path: string) => void;
}

export const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    savingsTotal,
    discountAmount,
    coupon,
    applyCouponCode,
    removeCoupon,
    shippingFee,
    tax,
    total,
    freeShippingThreshold,
    freeShippingProgress
  } = useCart();

  const { addToWishlist } = useWishlist();
  const [couponInput, setCouponInput] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setIsApplyingCoupon(true);
    const success = await applyCouponCode(couponInput.trim());
    if (success) {
      setCouponInput('');
    }
    setIsApplyingCoupon(false);
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Your Cart is Empty</h2>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Explore our trending electronics, apparel, and daily essentials!
          </p>
        </div>
        <div>
          <button
            onClick={() => onNavigate('/shop')}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
          >
            Start Shopping Now <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {items.length} unique item{items.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
        >
          <Trash2 className="w-4 h-4" /> Clear All
        </button>
      </div>

      {/* Free Shipping Progress Notification */}
      <div className="p-4 bg-blue-50/80 rounded-2xl border border-blue-200/80 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-blue-900 flex items-center gap-1.5">
            <Truck className="w-4 h-4 text-blue-600" />
            {freeShippingProgress >= 100 ? (
              <span className="text-emerald-700 font-bold">
                🎉 Congratulations! You have unlocked FREE Express Delivery!
              </span>
            ) : (
              <span>
                Add ${(freeShippingThreshold - subtotal).toFixed(2)} more of eligible products to qualify for <strong>FREE Delivery</strong>!
              </span>
            )}
          </span>
          <span className="font-bold text-blue-700">{Math.round(freeShippingProgress)}%</span>
        </div>
        <div className="w-full bg-blue-200/60 rounded-full h-2 overflow-hidden">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${freeShippingProgress}%` }}
          />
        </div>
      </div>

      {/* Grid: Cart Items on Left, Order Summary on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
            >
              {/* Product Info */}
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div
                  onClick={() => onNavigate(`/product/${item.productId}`)}
                  className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 border border-slate-200 shrink-0 cursor-pointer"
                >
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <h3
                    onClick={() => onNavigate(`/product/${item.productId}`)}
                    className="font-bold text-sm text-slate-900 truncate hover:text-blue-600 cursor-pointer"
                  >
                    {item.name}
                  </h3>

                  {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                    <div className="flex flex-wrap gap-1 text-[11px] text-slate-500">
                      {Object.entries(item.selectedVariants).map(([k, v]) => (
                        <span key={k} className="bg-slate-100 px-2 py-0.5 rounded-md">
                          {k}: <strong>{v}</strong>
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-bold text-slate-900">${item.price.toFixed(2)}</span>
                    {item.originalPrice > item.price && (
                      <span className="text-xs text-slate-400 line-through">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Stepper + Total + Remove */}
              <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-slate-100">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold text-slate-900 min-w-[32px] text-center bg-white">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2.5 py-1 text-slate-600 hover:bg-slate-200 font-bold text-sm"
                    disabled={item.quantity >= item.stock}
                  >
                    +
                  </button>
                </div>

                <div className="text-right">
                  <span className="text-base font-extrabold text-slate-900 block">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  title="Remove item"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center pt-2">
            <button
              onClick={() => onNavigate('/shop')}
              className="text-xs font-semibold text-blue-600 hover:underline"
            >
              &larr; Continue Shopping
            </button>
          </div>
        </div>

        {/* Order Summary & Coupon box */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-xs">
            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-100">
              Order Summary
            </h3>

            {/* Coupon Promo Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Promotional Code
              </label>
              {coupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-emerald-800">{coupon.code}</span>
                      <p className="text-[11px] text-emerald-600">{coupon.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="p-1 text-emerald-700 hover:text-rose-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="e.g. SUPER20, QUICK10"
                    className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-mono"
                  />
                  <button
                    type="submit"
                    disabled={isApplyingCoupon || !couponInput.trim()}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-colors"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Sample coupons hint */}
              <div className="mt-2 text-[11px] text-slate-400">
                Available codes: <strong className="text-blue-600 cursor-pointer" onClick={() => setCouponInput('QUICK10')}>QUICK10</strong> (10% off), <strong className="text-blue-600 cursor-pointer" onClick={() => setCouponInput('SUPER20')}>SUPER20</strong> (20% off $100+)
              </div>
            </div>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs text-slate-600 border-t border-slate-100 pt-4">
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

              {savingsTotal > 0 && (
                <div className="flex justify-between text-orange-600">
                  <span>Product Discounts</span>
                  <span>-${savingsTotal.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-slate-900">
                  {shippingFee === 0 ? <span className="text-emerald-600 font-bold">FREE</span> : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Estimated Tax (8%)</span>
                <span className="font-semibold text-slate-900">${tax.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-base">
                <span className="font-bold text-slate-900">Final Total</span>
                <span className="text-xl font-black text-slate-900">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Proceed to checkout CTA */}
            <button
              onClick={() => onNavigate('/checkout')}
              className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2 text-slate-700 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Secure Checkout Guarantee
            </div>
            <p>Every order is safeguarded by 256-bit encryption and backed by our full 30-day money-back guarantee.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

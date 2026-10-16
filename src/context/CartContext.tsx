import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { CartItem, Product, Coupon } from '../types';
import { couponAPI } from '../services/api';
import { useToast } from './ToastContext';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  coupon: Coupon | null;
  discountAmount: number;
  applyCouponCode: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
  subtotal: number;
  savingsTotal: number;
  shippingFee: number;
  tax: number;
  total: number;
  itemCount: number;
  freeShippingThreshold: number;
  freeShippingProgress: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'quickmart_cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to sync cart to storage:', e);
    }
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const savingsTotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const diff = (item.originalPrice || item.price) - item.price;
      return sum + (diff > 0 ? diff * item.quantity : 0);
    }, 0);
  }, [items]);

  const freeShippingThreshold = 75;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  // Re-verify coupon whenever subtotal changes
  useEffect(() => {
    if (coupon) {
      if (subtotal < coupon.minSpend) {
        setCoupon(null);
        setDiscountAmount(0);
        showToast(`Coupon ${coupon.code} removed as order total fell below $${coupon.minSpend}.`, 'info');
      } else {
        let disc = (subtotal * coupon.discountPercentage) / 100;
        if (coupon.maxDiscount && disc > coupon.maxDiscount) {
          disc = coupon.maxDiscount;
        }
        setDiscountAmount(Number(disc.toFixed(2)));
      }
    } else {
      setDiscountAmount(0);
    }
  }, [subtotal, coupon]);

  const shippingFee = subtotal === 0 || subtotal >= freeShippingThreshold || (coupon && coupon.code === 'FREESHIP') ? 0 : 7.99;
  const taxableAmount = Math.max(0, subtotal - discountAmount);
  const tax = Number((taxableAmount * 0.08).toFixed(2));
  const total = Number(Math.max(0, taxableAmount + shippingFee + tax).toFixed(2));
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = (product: Product, quantity = 1, selectedVariants?: Record<string, string>) => {
    const variantKey = selectedVariants ? JSON.stringify(selectedVariants) : '';
    const cartItemId = `${product.id}_${variantKey}`;

    setItems(prev => {
      const existing = prev.find(item => item.id === cartItemId);
      if (existing) {
        const newQty = Math.min(product.stock, existing.quantity + quantity);
        return prev.map(item =>
          item.id === cartItemId ? { ...item, quantity: newQty } : item
        );
      } else {
        const newItem: CartItem = {
          id: cartItemId,
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.images[0],
          quantity: Math.min(product.stock, Math.max(1, quantity)),
          selectedVariants,
          stock: product.stock,
          category: product.category
        };
        return [...prev, newItem];
      }
    });

    showToast(`Added "${product.name}" to your cart.`, 'success', 'Cart Updated');
  };

  const removeFromCart = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    setItems(prev => prev.filter(i => i.id !== itemId));
    if (item) {
      showToast(`Removed "${item.name}" from your cart.`, 'info');
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setItems(prev =>
      prev.map(item => {
        if (item.id === itemId) {
          const clamped = Math.min(item.stock, quantity);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    setCoupon(null);
    setDiscountAmount(0);
  };

  const applyCouponCode = async (code: string): Promise<boolean> => {
    try {
      const data = await couponAPI.applyCoupon(code, subtotal);
      if (data.success) {
        setCoupon(data.coupon);
        setDiscountAmount(data.discountAmount);
        showToast(data.message, 'success', 'Promo Code Applied');
        return true;
      }
      return false;
    } catch (err: any) {
      showToast(err.message || 'Failed to apply coupon.', 'error');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setDiscountAmount(0);
    showToast('Promo coupon removed.', 'info');
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        coupon,
        discountAmount,
        applyCouponCode,
        removeCoupon,
        subtotal: Number(subtotal.toFixed(2)),
        savingsTotal: Number(savingsTotal.toFixed(2)),
        shippingFee: Number(shippingFee.toFixed(2)),
        tax,
        total,
        itemCount,
        freeShippingThreshold,
        freeShippingProgress
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

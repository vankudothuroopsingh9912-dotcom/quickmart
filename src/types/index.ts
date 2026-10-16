export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  phone?: string;
  avatar?: string;
  addresses?: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  fullName: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface ProductVariant {
  id: string;
  name: string;
  options: string[]; // e.g. ['64GB', '128GB', '256GB'] or ['Small', 'Medium', 'Large']
}

export interface ProductSpecification {
  name: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  stock: number;
  category: string;
  brand: string;
  sku: string;
  images: string[];
  featured?: boolean;
  isNewArrival?: boolean;
  isDeal?: boolean;
  dealEndsAt?: string;
  variants?: ProductVariant[];
  specifications: ProductSpecification[];
  tags: string[];
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CartItem {
  id: string; // unique cart line id (e.g., productId + variants)
  productId: string;
  name: string;
  price: number;
  originalPrice: number;
  image: string;
  quantity: number;
  selectedVariants?: Record<string, string>;
  stock: number;
  category: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  minSpend: number;
  maxDiscount?: number;
  description: string;
  expiresAt: string;
}

export type OrderStatus =
  | 'Order Placed'
  | 'Confirmed'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled'
  | 'Return Requested';

export interface OrderTimelineEvent {
  status: OrderStatus;
  date: string;
  note: string;
  completed: boolean;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selectedVariants?: Record<string, string>;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: 'COD' | 'Razorpay' | 'Card';
  paymentStatus: 'Pending' | 'Paid' | 'Failed' | 'Refunded';
  paymentTransactionId?: string;
  shippingMethod: 'Standard' | 'Express';
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  timeline: OrderTimelineEvent[];
  trackingNumber: string;
  carrier: string;
  estimatedDelivery: string;
  createdAt: string;
  canCancel: boolean;
  returnReason?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  verifiedPurchase: boolean;
  createdAt: string;
}

export interface FilterState {
  category: string;
  brand: string[];
  minPrice: number;
  maxPrice: number;
  rating: number | null;
  inStockOnly: boolean;
  search: string;
  sortBy: 'popularity' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

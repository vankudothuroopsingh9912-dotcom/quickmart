import { Product, Category, User, Order, Review, Coupon, ContactMessage, OrderStatus } from '../../src/types';
import { initialCategories, initialProducts, initialCoupons, initialUsers } from '../data/seedData';

class DatabaseStore {
  public categories: Category[] = [...initialCategories];
  public products: Product[] = [...initialProducts];
  public coupons: Coupon[] = [...initialCoupons];
  public users: (User & { passwordHash?: string })[] = [
    { ...initialUsers[0], passwordHash: 'admin123' },
    { ...initialUsers[1], passwordHash: 'customer123' },
  ];
  public orders: Order[] = [
    {
      id: 'ORD-98214',
      userId: 'user-customer',
      customerName: 'Sarah Connor',
      customerEmail: 'sarah@quickmart.com',
      customerPhone: '+1 (555) 839-4412',
      items: [
        {
          productId: 'prod-elec-1',
          name: 'AcousticPro ANC Wireless Headphones',
          price: 199.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
          selectedVariants: { Color: 'Matte Black' }
        },
        {
          productId: 'prod-mob-2',
          name: 'VoltCore 20,000mAh 65W GaN Power Bank',
          price: 49.99,
          quantity: 1,
          image: 'https://images.unsplash.com/photo-1609592426868-80e90f2305a2?w=800&auto=format&fit=crop&q=80'
        }
      ],
      shippingAddress: initialUsers[1].addresses![0],
      paymentMethod: 'Razorpay',
      paymentStatus: 'Paid',
      paymentTransactionId: 'pay_rzp_demo_982143',
      shippingMethod: 'Express',
      subtotal: 249.98,
      discount: 24.99,
      shippingFee: 0,
      tax: 18.00,
      total: 242.99,
      couponCode: 'QUICK10',
      status: 'Shipped',
      trackingNumber: 'QM-EXP-8891024',
      carrier: 'QuickMart Express Carrier',
      estimatedDelivery: 'October 19, 2026',
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      canCancel: false,
      timeline: [
        {
          status: 'Order Placed',
          date: 'Oct 14, 2026 10:15 AM',
          note: 'Order placed successfully and payment captured via Razorpay.',
          completed: true
        },
        {
          status: 'Confirmed',
          date: 'Oct 14, 2026 10:30 AM',
          note: 'Payment verified and inventory allocated from Central Warehouse.',
          completed: true
        },
        {
          status: 'Processing',
          date: 'Oct 15, 2026 08:00 AM',
          note: 'Package packed and QA-checked with protective tamper-evident seal.',
          completed: true
        },
        {
          status: 'Shipped',
          date: 'Oct 15, 2026 03:45 PM',
          note: 'Dispatched via QuickMart Express. Tracking #QM-EXP-8891024 active.',
          completed: true
        },
        {
          status: 'Out for Delivery',
          date: 'Estimated Oct 18, 2026',
          note: 'Assigned to local delivery associate.',
          completed: false
        },
        {
          status: 'Delivered',
          date: 'Estimated Oct 19, 2026',
          note: 'Signed delivery at doorstep.',
          completed: false
        }
      ]
    }
  ];

  public reviews: Review[] = [
    {
      id: 'rev-1',
      productId: 'prod-elec-1',
      userId: 'user-customer',
      userName: 'Sarah Connor',
      rating: 5,
      title: 'Best ANC headphones in this price category!',
      comment: 'The noise cancellation is shockingly good on airplanes and trains. Battery lasted me almost a full week without a recharge.',
      verifiedPurchase: true,
      createdAt: '2026-09-15T14:30:00Z'
    },
    {
      id: 'rev-2',
      productId: 'prod-elec-1',
      userId: 'user-2',
      userName: 'David Miller',
      rating: 5,
      title: 'Comfortable for 8+ hour work days',
      comment: 'Zero ear pressure fatigue. Deep rich bass and crisp highs. Pair easily with my laptop and phone simultaneously.',
      verifiedPurchase: true,
      createdAt: '2026-09-18T09:12:00Z'
    },
    {
      id: 'rev-3',
      productId: 'prod-mob-1',
      userId: 'user-customer',
      userName: 'Sarah Connor',
      rating: 5,
      title: 'The camera clarity is next level',
      comment: 'The 200MP sensor catches astonishing detail even in dim evening light. Fast 100W charging is a lifesaver.',
      verifiedPurchase: true,
      createdAt: '2026-09-22T16:00:00Z'
    }
  ];

  public messages: ContactMessage[] = [];

  // Helper method to recalculate product rating and review count
  public recalculateProductRating(productId: string) {
    const prodReviews = this.reviews.filter(r => r.productId === productId);
    const product = this.products.find(p => p.id === productId);
    if (product) {
      if (prodReviews.length === 0) {
        product.reviewCount = 0;
        product.rating = 5.0;
      } else {
        const sum = prodReviews.reduce((acc, r) => acc + r.rating, 0);
        product.rating = Number((sum / prodReviews.length).toFixed(1));
        product.reviewCount = prodReviews.length;
      }
    }
  }

  // Deduct stock on order creation
  public deductStock(productId: string, quantity: number) {
    const prod = this.products.find(p => p.id === productId);
    if (prod) {
      prod.stock = Math.max(0, prod.stock - quantity);
    }
  }
}

export const db = new DatabaseStore();

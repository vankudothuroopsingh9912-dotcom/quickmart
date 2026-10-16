import { Router } from 'express';
import { db } from '../db/database';
import { authMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { Order, OrderTimelineEvent } from '../../src/types';

export const orderRouter = Router();

// Create new order
orderRouter.post('/', authMiddleware, (req: AuthenticatedRequest, res) => {
  const user = req.user;
  const {
    items,
    shippingAddress,
    paymentMethod,
    shippingMethod = 'Standard',
    couponCode,
    paymentTransactionId
  } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Your cart is empty.' });
  }

  if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.street) {
    return res.status(400).json({ success: false, message: 'Please provide a complete shipping address.' });
  }

  // Validate stock for all items
  for (const item of items) {
    const prod = db.products.find(p => p.id === item.productId);
    if (!prod) {
      return res.status(400).json({ success: false, message: `Product "${item.name}" is no longer available.` });
    }
    if (prod.stock < item.quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${prod.stock} units available for "${prod.name}". Please reduce quantity.`
      });
    }
  }

  // Calculate financials safely server-side
  let subtotal = 0;
  items.forEach(item => {
    const prod = db.products.find(p => p.id === item.productId);
    const unitPrice = prod ? prod.price : item.price;
    subtotal += unitPrice * item.quantity;
  });

  // Calculate coupon discount
  let discount = 0;
  if (couponCode) {
    const coupon = db.coupons.find(c => c.code.toUpperCase() === couponCode.trim().toUpperCase());
    if (coupon && subtotal >= coupon.minSpend) {
      discount = (subtotal * coupon.discountPercentage) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    }
  }

  const shippingFee = shippingMethod === 'Express' ? 14.99 : subtotal > 75 ? 0 : 7.99;
  const tax = Number(((subtotal - discount) * 0.08).toFixed(2));
  const total = Number(Math.max(0, subtotal - discount + shippingFee + tax).toFixed(2));

  // Deduct inventory
  items.forEach(item => {
    db.deductStock(item.productId, item.quantity);
  });

  const orderId = `ORD-${Math.floor(10000 + Math.random() * 90000)}`;
  const trackingNumber = `QM-${shippingMethod === 'Express' ? 'EXP' : 'STD'}-${Math.floor(100000 + Math.random() * 900000)}`;

  const now = new Date();
  const estimatedDate = new Date(now.getTime() + (shippingMethod === 'Express' ? 86400000 * 2 : 86400000 * 5));
  const estimatedDelivery = estimatedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  const initialTimeline: OrderTimelineEvent[] = [
    {
      status: 'Order Placed',
      date: now.toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      note: paymentMethod === 'Razorpay'
        ? 'Order placed and payment authorized via Razorpay Gateway.'
        : 'Order placed with Cash On Delivery. Verification SMS sent.',
      completed: true
    },
    {
      status: 'Confirmed',
      date: new Date(now.getTime() + 1800000).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      note: 'Order confirmed and inventory booked in QuickMart fulfillment hub.',
      completed: true
    },
    {
      status: 'Processing',
      date: 'Pending',
      note: 'Packaging items with tamper-evident seal and invoice generation.',
      completed: false
    },
    {
      status: 'Shipped',
      date: 'Pending',
      note: `Courier dispatch via QuickMart Logistics. Waybill #${trackingNumber}.`,
      completed: false
    },
    {
      status: 'Out for Delivery',
      date: 'Pending',
      note: 'Driver assigned for final-mile doorstep delivery.',
      completed: false
    },
    {
      status: 'Delivered',
      date: `Estimated ${estimatedDelivery}`,
      note: 'Recipient signature upon receipt.',
      completed: false
    }
  ];

  const newOrder: Order = {
    id: orderId,
    userId: user.id,
    customerName: user.name,
    customerEmail: user.email,
    customerPhone: shippingAddress.phone || user.phone,
    items,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
    paymentTransactionId: paymentTransactionId || (paymentMethod === 'Razorpay' ? `pay_rzp_${Date.now()}` : undefined),
    shippingMethod,
    subtotal: Number(subtotal.toFixed(2)),
    discount: Number(discount.toFixed(2)),
    shippingFee: Number(shippingFee.toFixed(2)),
    tax: Number(tax.toFixed(2)),
    total,
    couponCode,
    status: 'Confirmed',
    timeline: initialTimeline,
    trackingNumber,
    carrier: 'QuickMart Express Logistics',
    estimatedDelivery,
    createdAt: now.toISOString(),
    canCancel: true
  };

  db.orders.unshift(newOrder);

  return res.status(201).json({
    success: true,
    message: 'Order placed successfully!',
    order: newOrder
  });
});

// Razorpay payment verification test-mode endpoint
orderRouter.post('/verify-payment', authMiddleware, (req, res) => {
  const { orderId, razorpay_payment_id } = req.body;

  const order = db.orders.find(o => o.id === orderId);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  // Verify and update status
  order.paymentStatus = 'Paid';
  order.paymentTransactionId = razorpay_payment_id || `rzp_verified_${Date.now()}`;

  return res.json({
    success: true,
    message: 'Razorpay payment verified and captured successfully!',
    order
  });
});

// Get user orders
orderRouter.get('/my-orders', authMiddleware, (req: AuthenticatedRequest, res) => {
  const userOrders = db.orders.filter(o => o.userId === req.user.id);
  return res.json({ success: true, orders: userOrders });
});

// Get order by ID or tracking number
orderRouter.get('/:id', (req, res) => {
  const { id } = req.params;
  const order = db.orders.find(o => o.id.toUpperCase() === id.toUpperCase() || o.trackingNumber.toUpperCase() === id.toUpperCase());

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order or tracking number not found.' });
  }

  return res.json({ success: true, order });
});

// Cancel order
orderRouter.post('/:id/cancel', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const order = db.orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }

  if (['Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'].includes(order.status)) {
    return res.status(400).json({
      success: false,
      message: `Cannot cancel an order that is already ${order.status.toLowerCase()}.`
    });
  }

  order.status = 'Cancelled';
  order.canCancel = false;
  if (order.paymentStatus === 'Paid') {
    order.paymentStatus = 'Refunded';
  }

  // Restore inventory
  order.items.forEach(item => {
    const prod = db.products.find(p => p.id === item.productId);
    if (prod) {
      prod.stock += item.quantity;
    }
  });

  order.timeline.push({
    status: 'Cancelled',
    date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    note: 'Order was cancelled by the customer. Any refund has been initiated to original payment source.',
    completed: true
  });

  return res.json({ success: true, message: 'Order successfully cancelled.', order });
});

// Request return
orderRouter.post('/:id/return', authMiddleware, (req: AuthenticatedRequest, res) => {
  const { id } = req.params;
  const { reason } = req.body;
  const order = db.orders.find(o => o.id === id);

  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied.' });
  }

  order.status = 'Return Requested';
  order.returnReason = reason || 'Customer requested return within 30-day policy window.';
  order.timeline.push({
    status: 'Return Requested',
    date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    note: `Return authorization requested: ${order.returnReason}. Prepaid return label issued.`,
    completed: true
  });

  return res.json({ success: true, message: 'Return request submitted. Please print the prepaid shipping label.', order });
});

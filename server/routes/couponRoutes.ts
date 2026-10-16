import { Router } from 'express';
import { db } from '../db/database';

export const couponRouter = Router();

// GET all active coupons
couponRouter.get('/', (req, res) => {
  return res.json({ success: true, coupons: db.coupons });
});

// POST validate coupon code
couponRouter.post('/apply', (req, res) => {
  const { code, subtotal } = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({ success: false, message: 'Please provide a valid coupon code.' });
  }

  const coupon = db.coupons.find(c => c.code.toUpperCase() === code.trim().toUpperCase());
  if (!coupon) {
    return res.status(404).json({ success: false, message: 'Invalid promotional code.' });
  }

  const orderSubtotal = parseFloat(subtotal) || 0;
  if (orderSubtotal < coupon.minSpend) {
    return res.status(400).json({
      success: false,
      message: `Coupon requires a minimum order value of $${coupon.minSpend.toFixed(2)}.`
    });
  }

  let discount = (orderSubtotal * coupon.discountPercentage) / 100;
  if (coupon.maxDiscount && discount > coupon.maxDiscount) {
    discount = coupon.maxDiscount;
  }

  return res.json({
    success: true,
    message: `Coupon '${coupon.code}' applied! You saved $${discount.toFixed(2)}.`,
    coupon,
    discountAmount: Number(discount.toFixed(2))
  });
});

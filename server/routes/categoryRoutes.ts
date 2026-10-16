import { Router } from 'express';
import { db } from '../db/database';

export const categoryRouter = Router();

categoryRouter.get('/', (req, res) => {
  // Update product counts dynamically
  const categories = db.categories.map(cat => ({
    ...cat,
    productCount: db.products.filter(p => p.category === cat.slug).length
  }));

  return res.json({ success: true, categories });
});

import { Router } from 'express';
import { db } from '../db/database';
import { adminMiddleware, AuthenticatedRequest } from '../middleware/auth';
import { Product, OrderStatus } from '../../src/types';

export const adminRouter = Router();

// Apply adminMiddleware to all admin endpoints
adminRouter.use(adminMiddleware);

// GET /api/admin/stats
adminRouter.get('/stats', (req, res) => {
  const totalRevenue = db.orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const totalOrders = db.orders.length;
  const totalCustomers = db.users.filter(u => u.role === 'customer').length;
  const lowStockProducts = db.products.filter(p => p.stock < 15);
  const outOfStockProducts = db.products.filter(p => p.stock === 0);

  // Status breakdown
  const statusCounts: Record<string, number> = {};
  db.orders.forEach(o => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  return res.json({
    success: true,
    stats: {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders,
      totalCustomers,
      totalProducts: db.products.length,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      statusCounts,
      recentOrders: db.orders.slice(0, 5),
      lowStockProducts: lowStockProducts.slice(0, 5)
    }
  });
});

// GET /api/admin/products
adminRouter.get('/products', (req, res) => {
  return res.json({ success: true, products: db.products });
});

// POST /api/admin/products (Create product)
adminRouter.post('/products', (req, res) => {
  const {
    name,
    description,
    price,
    originalPrice,
    category,
    brand,
    stock,
    images,
    specifications,
    tags
  } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ success: false, message: 'Name, price, and category are required.' });
  }

  const p = parseFloat(price);
  const op = originalPrice ? parseFloat(originalPrice) : p;
  const discountPercentage = op > p ? Math.round(((op - p) / op) * 100) : 0;
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name: name.trim(),
    slug,
    description: description || 'High-performance premium product designed for superior durability and value.',
    price: p,
    originalPrice: op,
    discountPercentage,
    rating: 5.0,
    reviewCount: 0,
    stock: parseInt(stock, 10) || 10,
    category,
    brand: brand || 'QuickMart Choice',
    sku: `QM-${Date.now().toString().slice(-6)}`,
    images: Array.isArray(images) && images.length > 0 ? images : [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80'
    ],
    featured: Boolean(req.body.featured),
    isNewArrival: true,
    specifications: specifications || [{ name: 'Warranty', value: '1 Year QuickMart Warranty' }],
    tags: tags || ['new', category],
    createdAt: new Date().toISOString()
  };

  db.products.unshift(newProduct);
  return res.status(201).json({ success: true, message: 'Product created successfully!', product: newProduct });
});

// PUT /api/admin/products/:id (Update product)
adminRouter.put('/products/:id', (req, res) => {
  const { id } = req.params;
  const product = db.products.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  const { name, price, originalPrice, stock, category, brand, description, images, featured } = req.body;

  if (name) product.name = name.trim();
  if (price !== undefined) product.price = parseFloat(price);
  if (originalPrice !== undefined) product.originalPrice = parseFloat(originalPrice);
  if (product.originalPrice > product.price) {
    product.discountPercentage = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  } else {
    product.discountPercentage = 0;
  }
  if (stock !== undefined) product.stock = parseInt(stock, 10);
  if (category) product.category = category;
  if (brand) product.brand = brand;
  if (description) product.description = description;
  if (images && Array.isArray(images)) product.images = images;
  if (featured !== undefined) product.featured = Boolean(featured);

  return res.json({ success: true, message: 'Product updated successfully!', product });
});

// DELETE /api/admin/products/:id
adminRouter.delete('/products/:id', (req, res) => {
  const { id } = req.params;
  const index = db.products.findIndex(p => p.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Product not found.' });
  }

  db.products.splice(index, 1);
  return res.json({ success: true, message: 'Product deleted successfully.' });
});

// GET /api/admin/orders
adminRouter.get('/orders', (req, res) => {
  return res.json({ success: true, orders: db.orders });
});

// PUT /api/admin/orders/:id/status
adminRouter.put('/orders/:id/status', (req, res) => {
  const { id } = req.params;
  const { status, note } = req.body;

  const order = db.orders.find(o => o.id === id);
  if (!order) {
    return res.status(404).json({ success: false, message: 'Order not found.' });
  }

  order.status = status as OrderStatus;

  // Add entry to timeline
  const now = new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  order.timeline.push({
    status: order.status,
    date: now,
    note: note || `Order status advanced to ${order.status} by logistics manager.`,
    completed: true
  });

  if (order.status === 'Delivered') {
    order.canCancel = false;
    order.paymentStatus = 'Paid';
  } else if (order.status === 'Cancelled') {
    order.canCancel = false;
  }

  return res.json({ success: true, message: `Order status updated to "${order.status}".`, order });
});

// GET /api/admin/customers
adminRouter.get('/customers', (req, res) => {
  const customers = db.users.map(u => {
    const { passwordHash, ...clean } = u;
    const orderCount = db.orders.filter(o => o.userId === u.id).length;
    const totalSpent = db.orders
      .filter(o => o.userId === u.id && o.status !== 'Cancelled')
      .reduce((sum, o) => sum + o.total, 0);

    return {
      ...clean,
      orderCount,
      totalSpent: Number(totalSpent.toFixed(2))
    };
  });

  return res.json({ success: true, customers });
});

// PUT /api/admin/customers/:id/role
adminRouter.put('/customers/:id/role', (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const user = db.users.find(u => u.id === id);
  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found.' });
  }

  if (role !== 'admin' && role !== 'customer') {
    return res.status(400).json({ success: false, message: 'Role must be "customer" or "admin".' });
  }

  user.role = role;
  const { passwordHash, ...clean } = user;
  return res.json({ success: true, message: `User role changed to ${role}.`, user: clean });
});

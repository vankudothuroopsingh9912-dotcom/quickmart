import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { authRouter } from './server/routes/authRoutes';
import { productRouter } from './server/routes/productRoutes';
import { categoryRouter } from './server/routes/categoryRoutes';
import { orderRouter } from './server/routes/orderRoutes';
import { couponRouter } from './server/routes/couponRoutes';
import { adminRouter } from './server/routes/adminRoutes';
import { contactRouter } from './server/routes/contactRoutes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Mount API routers
  app.use('/api/auth', authRouter);
  app.use('/api/products', productRouter);
  app.use('/api/categories', categoryRouter);
  app.use('/api/orders', orderRouter);
  app.use('/api/coupons', couponRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/contact', contactRouter);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  if (!isProd) {
    // In development mode, attach Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built static files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 QuickMart server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start QuickMart server:', err);
  process.exit(1);
});

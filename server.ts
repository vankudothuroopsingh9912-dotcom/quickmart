import express from 'express';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server as SocketIOServer } from 'socket.io';

import { authRouter } from './server/routes/authRoutes';
import { userRouter } from './server/routes/userRoutes';
import { conversationRouter } from './server/routes/conversationRoutes';
import { messageRouter } from './server/routes/messageRoutes';
import { notificationRouter } from './server/routes/notificationRoutes';
import { adminRouter } from './server/routes/adminRoutes';
import { setupSocketIO } from './server/sockets/socketHandler';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProd = process.env.NODE_ENV === 'production';

  // Attach Socket.IO
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  setupSocketIO(io);

  app.use(express.json({ limit: '20mb' }));

  // API Routes
  app.use('/api/auth', authRouter);
  app.use('/api/users', userRouter);
  app.use('/api/conversations', conversationRouter);
  app.use('/api/messages', messageRouter);
  app.use('/api/notifications', notificationRouter);
  app.use('/api/admin', adminRouter);

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'ChatFlow Real-Time Platform',
      time: new Date().toISOString()
    });
  });

  if (!isProd) {
    // In dev mode, attach Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve built assets
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 ChatFlow server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start ChatFlow server:', err);
  process.exit(1);
});

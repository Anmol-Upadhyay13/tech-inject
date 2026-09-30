import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer as createViteServer } from 'vite';
import { initDatabase } from './backend/db/database.ts';
import { authRouter } from './backend/routes/auth.routes.ts';
import { componentsRouter } from './backend/routes/components.routes.ts';
import { adminRouter } from './backend/routes/admin.routes.ts';
import { cliRouter } from './backend/routes/cli.routes.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  // 1. Initialize persistent SQLite database & seed accounts
  initDatabase();

  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  // Middlewares
  app.use(express.json({ limit: '10mb' }));
  app.use(cookieParser());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'Tech Inject Design Library Platform', timestamp: new Date().toISOString() });
  });

  // API Routers
  app.use('/api/auth', authRouter);
  app.use('/api/components', componentsRouter);
  app.use('/api/admin', adminRouter);
  app.use('/api/cli', cliRouter);

  // Serve Frontend
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    // Development mode with Vite middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Tech Inject] Full-stack Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Tech Inject] Failed to start server:', err);
  process.exit(1);
});

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pool } from './config/db.js';
import { authenticate } from './middlewares/auth.js';
import { errorHandler, notFound } from './middlewares/errors.js';
import apiRoutes from './routes/index.js';

export function createApp() {
  const app = express();
  const origins = (process.env.CLIENT_ORIGIN || 'http://localhost:5173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({
    origin(origin, callback) {
      if (!origin || origins.includes(origin)) return callback(null, true);
      callback(Object.assign(new Error('Origen no autorizado.'), { status: 403 }));
    }
  }));
  app.use(express.json({ limit: '100kb' }));
  app.get('/api/health', async (req, res, next) => {
    try {
      await pool.query('SELECT 1');
      res.json({ status: 'ok', service: 'mercado-seguro-api', database: 'connected' });
    } catch (error) {
      next(error);
    }
  });
  app.use('/api', apiRoutes);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}

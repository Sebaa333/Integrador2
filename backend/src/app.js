import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/config.js';
import apiRoutes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors({ origin: config.corsOrigins.includes('*') ? '*' : config.corsOrigins }));
  app.use(express.json({ limit: '1mb' }));
  if (config.env !== 'test') app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));

  app.get('/', (_req, res) => res.json({ nombre: 'Integrador 2 API', docs: '/api/health' }));
  app.use('/api', apiRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

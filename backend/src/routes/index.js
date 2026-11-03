import { Router } from 'express';
import mongoose from 'mongoose';
import productosRoutes from './productos.routes.js';
import carritoRoutes from './carrito.routes.js';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});
router.use('/productos', productosRoutes);
router.use('/carrito', carritoRoutes);

export default router;

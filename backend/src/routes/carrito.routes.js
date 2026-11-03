import { Router } from 'express';
import { createCarrito, getCarritos } from '../controllers/carrito.controller.js';

const router = Router();

router.post('/', createCarrito);
router.get('/', getCarritos);

export default router;

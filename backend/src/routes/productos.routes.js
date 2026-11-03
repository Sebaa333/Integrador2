import { Router } from 'express';
import validateObjectId from '../middlewares/validateObjectId.js';
import {
  getProductos, getProducto, createProducto, updateProducto, deleteProducto,
} from '../controllers/productos.controller.js';

const router = Router();

router.get('/', getProductos);
router.post('/', createProducto);
router.get('/:id', validateObjectId(), getProducto);
router.put('/:id', validateObjectId(), updateProducto);
router.delete('/:id', validateObjectId(), deleteProducto);

export default router;

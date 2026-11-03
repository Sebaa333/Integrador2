import mongoose from 'mongoose';
import Carrito from '../models/carrito.model.js';
import HttpError from '../utils/httpError.js';

// Accepts either a raw array of items or { "carrito": [...] }.
function extraerItems(body) {
  if (Array.isArray(body)) return body;
  if (body && Array.isArray(body.carrito)) return body.carrito;
  return null;
}

function normalizarItem(item = {}) {
  const productoId = item.producto ?? item.id ?? item._id;
  return {
    producto: mongoose.isValidObjectId(productoId) ? productoId : undefined,
    nombre: item.nombre,
    precio: Number(item.precio),
    cantidad: Number(item.cantidad ?? 1),
  };
}

export async function createCarrito(req, res) {
  const items = extraerItems(req.body);
  if (!items) {
    throw new HttpError(400, 'Se esperaba un array de productos (o { "carrito": [...] })');
  }

  console.log('[carrito] Pedido recibido:');
  console.dir(items, { depth: null });

  const normalizados = items.map(normalizarItem);
  const total = normalizados.reduce((acc, i) => acc + (i.precio || 0) * (i.cantidad || 0), 0);
  const carrito = await Carrito.create({ items: normalizados, total: Math.round(total * 100) / 100 });

  res.status(201).json({ mensaje: 'Pedido recibido', pedido: carrito });
}

export async function getCarritos(_req, res) {
  const carritos = await Carrito.find().sort({ createdAt: -1 });
  res.json(carritos);
}

import Producto from '../models/producto.model.js';
import HttpError from '../utils/httpError.js';

// Only these fields can be written by clients (prevents mass assignment of _id, timestamps, etc.).
const CAMPOS_EDITABLES = [
  'nombre', 'precio', 'stock', 'marca', 'categoria', 'descripcionCorta',
  'descripcionLarga', 'edadDesde', 'edadHasta', 'envio', 'foto',
];

function pickEditables(body = {}) {
  return Object.fromEntries(Object.entries(body).filter(([key]) => CAMPOS_EDITABLES.includes(key)));
}

export async function getProductos(_req, res) {
  const productos = await Producto.find().sort({ createdAt: -1 });
  res.json(productos);
}

export async function getProducto(req, res) {
  const producto = await Producto.findById(req.params.id);
  if (!producto) throw new HttpError(404, 'Producto no encontrado');
  res.json(producto);
}

export async function createProducto(req, res) {
  const producto = await Producto.create(pickEditables(req.body));
  res.status(201).json(producto);
}

export async function updateProducto(req, res) {
  const producto = await Producto.findByIdAndUpdate(req.params.id, pickEditables(req.body), {
    new: true,
    runValidators: true,
  });
  if (!producto) throw new HttpError(404, 'Producto no encontrado');
  res.json(producto);
}

export async function deleteProducto(req, res) {
  const producto = await Producto.findByIdAndDelete(req.params.id);
  if (!producto) throw new HttpError(404, 'Producto no encontrado');
  res.json({ mensaje: 'Producto eliminado', producto });
}

import mongoose from 'mongoose';
import HttpError from '../utils/httpError.js';

export function notFound(req, _res, next) {
  next(new HttpError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.values(err.errors).map((e) => ({ campo: e.path, mensaje: e.message }));
    return res.status(400).json({ error: 'Datos inválidos', details });
  }
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ error: `Valor inválido para "${err.path}"` });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'El cuerpo de la petición no es un JSON válido' });
  }
  if (err instanceof HttpError) {
    return res.status(err.status).json({ error: err.message, ...(err.details && { details: err.details }) });
  }

  console.error('[error]', err);
  res.status(500).json({ error: 'Error interno del servidor' });
}

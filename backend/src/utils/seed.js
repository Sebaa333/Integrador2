// Loads sample products into the database pointed to by MONGODB_URI.
// Usage: npm run seed           (only inserts when the collection is empty)
//        npm run seed -- --force (deletes existing products first)
import config from '../config/config.js';
import { connectDB, disconnectDB } from '../config/db.js';
import Producto from '../models/producto.model.js';

const productos = [
  { nombre: 'Auto a control remoto', precio: 25000, stock: 10, marca: 'Speedy', categoria: 'Vehículos', descripcionCorta: 'Auto 4x4 recargable', edadDesde: 6, edadHasta: 12, envio: true, foto: 'https://picsum.photos/seed/auto/400' },
  { nombre: 'Muñeca articulada', precio: 18000, stock: 15, marca: 'Dollie', categoria: 'Muñecas', descripcionCorta: 'Con 3 cambios de ropa', edadDesde: 3, edadHasta: 10, envio: true, foto: 'https://picsum.photos/seed/muneca/400' },
  { nombre: 'Bloques de construcción', precio: 32000, stock: 8, marca: 'Bricky', categoria: 'Construcción', descripcionCorta: 'Set de 500 piezas', edadDesde: 5, edadHasta: 99, envio: false, foto: 'https://picsum.photos/seed/bloques/400' },
  { nombre: 'Pelota de fútbol', precio: 12000, stock: 20, marca: 'Golazo', categoria: 'Deportes', descripcionCorta: 'Número 5, cosida a mano', edadDesde: 6, edadHasta: 99, envio: true, foto: 'https://picsum.photos/seed/pelota/400' },
];

try {
  await connectDB(config.mongoUri);
  const force = process.argv.includes('--force');
  const existentes = await Producto.countDocuments();
  if (existentes > 0 && !force) {
    console.log(`[seed] Ya hay ${existentes} productos. Usá "npm run seed -- --force" para reemplazarlos.`);
  } else {
    if (force) await Producto.deleteMany({});
    const creados = await Producto.insertMany(productos);
    console.log(`[seed] ${creados.length} productos cargados.`);
  }
} catch (err) {
  console.error('[seed] Error:', err.message);
  process.exitCode = 1;
} finally {
  await disconnectDB();
}

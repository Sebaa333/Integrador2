import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

process.env.NODE_ENV = 'test';
const { createApp } = await import('../src/app.js');
const { default: Producto } = await import('../src/models/producto.model.js');
const { default: Carrito } = await import('../src/models/carrito.model.js');

let mongod;
let app;
const valido = { nombre: 'Auto a control', precio: 1500, stock: 3, envio: true };

before(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  app = createApp();
});
after(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
beforeEach(async () => {
  await Producto.deleteMany({});
  await Carrito.deleteMany({});
});

test('GET /api/health responde ok', async () => {
  const res = await request(app).get('/api/health');
  assert.equal(res.status, 200);
  assert.deepEqual(res.body, { status: 'ok', db: 'connected' });
});

test('POST /api/productos crea y devuelve 201 con id', async () => {
  const res = await request(app).post('/api/productos').send({ ...valido, _id: 'x', createdAt: 'hack' });
  assert.equal(res.status, 201);
  assert.ok(res.body.id);
  assert.equal(res.body._id, undefined);
  assert.equal(res.body.nombre, 'Auto a control');
  assert.equal(await Producto.countDocuments(), 1);
});

test('POST /api/productos inválido devuelve 400 y no guarda nada', async () => {
  const res = await request(app).post('/api/productos').send({ nombre: 'ab', precio: -1 });
  assert.equal(res.status, 400);
  assert.equal(res.body.error, 'Datos inválidos');
  const campos = res.body.details.map((d) => d.campo).sort();
  assert.deepEqual(campos, ['nombre', 'precio']);
  assert.equal(await Producto.countDocuments(), 0);
});

test('POST con JSON mal formado devuelve 400', async () => {
  const res = await request(app).post('/api/productos').set('Content-Type', 'application/json').send('{mal');
  assert.equal(res.status, 400);
  assert.equal(res.body.error, 'El cuerpo de la petición no es un JSON válido');
});

test('GET /api/productos lista y GET /:id obtiene uno', async () => {
  const creado = await Producto.create(valido);
  const lista = await request(app).get('/api/productos');
  assert.equal(lista.status, 200);
  assert.equal(lista.body.length, 1);
  const uno = await request(app).get(`/api/productos/${creado.id}`);
  assert.equal(uno.status, 200);
  assert.equal(uno.body.id, creado.id);
});

test('GET /:id con id inválido → 400, inexistente → 404', async () => {
  const malo = await request(app).get('/api/productos/123');
  assert.equal(malo.status, 400);
  const noExiste = await request(app).get(`/api/productos/${new mongoose.Types.ObjectId()}`);
  assert.equal(noExiste.status, 404);
  assert.equal(noExiste.body.error, 'Producto no encontrado');
});

test('PUT /api/productos/:id actualiza y valida', async () => {
  const creado = await Producto.create(valido);
  const ok = await request(app).put(`/api/productos/${creado.id}`).send({ precio: 2000 });
  assert.equal(ok.status, 200);
  assert.equal(ok.body.precio, 2000);
  const bad = await request(app).put(`/api/productos/${creado.id}`).send({ precio: -5 });
  assert.equal(bad.status, 400);
  assert.equal((await Producto.findById(creado.id)).precio, 2000);
  const noExiste = await request(app).put(`/api/productos/${new mongoose.Types.ObjectId()}`).send({ precio: 1 });
  assert.equal(noExiste.status, 404);
});

test('DELETE /api/productos/:id elimina', async () => {
  const creado = await Producto.create(valido);
  const res = await request(app).delete(`/api/productos/${creado.id}`);
  assert.equal(res.status, 200);
  assert.equal(res.body.mensaje, 'Producto eliminado');
  assert.equal(await Producto.countDocuments(), 0);
  const otra = await request(app).delete(`/api/productos/${creado.id}`);
  assert.equal(otra.status, 404);
});

test('POST /api/carrito guarda el pedido, calcula total y lo loguea en consola', async (t) => {
  const logs = t.mock.method(console, 'log', () => {});
  t.mock.method(console, 'dir', () => {});
  const items = [
    { id: new mongoose.Types.ObjectId().toString(), nombre: 'A', precio: 100, cantidad: 2 },
    { nombre: 'B', precio: 50.5, cantidad: 1 },
  ];
  const res = await request(app).post('/api/carrito').send(items);
  assert.equal(res.status, 201);
  assert.equal(res.body.pedido.total, 250.5);
  assert.equal(res.body.pedido.items.length, 2);
  assert.ok(logs.mock.calls.some((c) => String(c.arguments[0]).includes('Pedido recibido')));
  assert.equal(await Carrito.countDocuments(), 1);

  const envuelto = await request(app).post('/api/carrito').send({ carrito: items });
  assert.equal(envuelto.status, 201);
});

test('POST /api/carrito rechaza vacío o no-array sin guardar', async (t) => {
  t.mock.method(console, 'log', () => {});
  t.mock.method(console, 'dir', () => {});
  const noArray = await request(app).post('/api/carrito').send({ foo: 1 });
  assert.equal(noArray.status, 400);
  const vacio = await request(app).post('/api/carrito').send([]);
  assert.equal(vacio.status, 400);
  const sinCantidad = await request(app).post('/api/carrito').send([{ nombre: 'A', precio: 1, cantidad: 0 }]);
  assert.equal(sinCantidad.status, 400);
  assert.equal(await Carrito.countDocuments(), 0);
});

test('ruta inexistente devuelve 404 JSON', async () => {
  const res = await request(app).get('/api/nada');
  assert.equal(res.status, 404);
  assert.equal(res.body.error, 'Ruta no encontrada: GET /api/nada');
});

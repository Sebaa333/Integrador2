# Integrador 2 — Backend

API REST con **Node.js + Express + Mongoose** sobre **MongoDB Atlas**, con arquitectura MVC.

## Estructura

```
src/
  config/       config.js (puerto, URI, CORS) y db.js (conexión a Mongo)
  models/       producto.model.js, carrito.model.js
  controllers/  lógica de cada caso de uso
  routes/       definición de endpoints (/api/...)
  middlewares/  validación de ids, 404 y manejo centralizado de errores
  utils/        HttpError y script de seed
  app.js        arma la app de Express (sin levantar el puerto)
  server.js     conecta a la DB y escucha
tests/          tests de integración (Mongo en memoria, no tocan Atlas)
postman/        colección lista para importar
```

## Puesta en marcha local

1. `npm install`
2. Copiar `.env.example` a `.env` y completar `MONGODB_URI` con el string de Atlas
   (Atlas → *Connect* → *Drivers*). Dejá `/integrador2` como nombre de la base: Mongo la crea sola.
   En Atlas → *Network Access* tiene que estar permitida tu IP (o `0.0.0.0/0` para Railway).
3. `npm run seed` para cargar productos de ejemplo (opcional).
4. `npm run dev` (recarga sola) o `npm start`.
5. `npm test` corre los tests.

## Endpoints

| Método | Ruta | Descripción |
| --- | --- | --- |
| GET | `/api/health` | Estado del server y de la DB |
| GET | `/api/productos` | Lista todos los productos |
| GET | `/api/productos/:id` | Obtiene un producto |
| POST | `/api/productos` | Crea un producto |
| PUT | `/api/productos/:id` | Actualiza un producto |
| DELETE | `/api/productos/:id` | Elimina un producto |
| POST | `/api/carrito` | Recibe el carrito (array JSON), lo muestra en consola y lo guarda |
| GET | `/api/carrito` | Lista los pedidos recibidos |

Producto: `nombre` (obligatorio, 3–60), `precio` (obligatorio, ≥ 0), `stock`, `marca`, `categoria`,
`descripcionCorta`, `descripcionLarga`, `edadDesde`, `edadHasta`, `envio`, `foto`.

Carrito: un array `[{ "id", "nombre", "precio", "cantidad" }]` o `{ "carrito": [...] }`.
El total lo calcula el servidor.

Errores: siempre JSON `{ "error": "...", "details"?: [...] }` con 400 (datos inválidos), 404 o 500.

## Postman

Importá `postman/Integrador2.postman_collection.json`. La variable `baseUrl` apunta a
`http://localhost:8080`; cambiala por la URL de Railway cuando esté desplegado.
"Crear producto" guarda el id en `productoId` para los siguientes requests.

## Deploy en Railway

1. New Project → *Deploy from GitHub repo* → elegir este repo.
2. En *Settings*, poner **Root Directory** = `backend`.
3. En *Variables*: `MONGODB_URI`, `NODE_ENV=production` y `CORS_ORIGIN` (URL del front, o `*`).
   `PORT` lo pone Railway solo.
4. *Settings → Networking → Generate Domain*. La API queda en `https://<tu-app>.up.railway.app/api/productos`.

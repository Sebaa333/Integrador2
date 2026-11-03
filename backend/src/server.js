import config from './config/config.js';
import { connectDB, disconnectDB } from './config/db.js';
import { createApp } from './app.js';

async function start() {
  try {
    await connectDB(config.mongoUri);
    const app = createApp();
    const server = app.listen(config.port, '0.0.0.0', () => {
      console.log(`[server] Listening on port ${config.port} (${config.env})`);
    });

    const shutdown = (signal) => {
      console.log(`[server] ${signal} received, shutting down...`);
      server.close(async () => {
        await disconnectDB();
        process.exit(0);
      });
    };
    process.on('SIGTERM', shutdown);
    process.on('SIGINT', shutdown);
  } catch (err) {
    console.error('[server] Failed to start:', err.message);
    process.exit(1);
  }
}

start();

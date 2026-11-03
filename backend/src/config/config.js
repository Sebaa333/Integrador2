import 'dotenv/config';

// Central server configuration. Every value comes from environment variables
// (a local .env file in development, Railway variables in production).
const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT) || 8080,
  mongoUri: process.env.MONGODB_URI ?? '',
  // Comma-separated list of allowed frontend origins; "*" allows any origin.
  corsOrigins: (process.env.CORS_ORIGIN ?? '*')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
};

export default config;

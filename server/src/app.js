import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import compress from '@fastify/compress';
import rateLimit from '@fastify/rate-limit';
import caching from '@fastify/caching';
import jwt from '@fastify/jwt';

import generateRoutes from './routes/generate.routes.js';
import projectRoutes from './routes/project.routes.js';
import authRoutes from './routes/auth.routes.js';
import { errorHandler } from './middleware/error.middleware.js';

const buildApp = async () => {
  const app = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
    disableRequestLogging: false,
  });

  // Security and compression plugins
  await app.register(helmet, { global: true });
  const devOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    process.env.FRONTEND_URL,
  ].filter(Boolean);

  await app.register(cors, {
    origin: process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL || 'https://yourdomain.com']
      : devOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH']
  });
  await app.register(compress, { global: true });
  
  // Rate limiting (protects against abuse)
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
  });

  // Basic caching setup
  await app.register(caching, {
    privacy: caching.privacy.NOCACHE
  });

  // JWT Setup
  await app.register(jwt, {
    secret: process.env.JWT_SECRET || (() => {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('JWT_SECRET environment variable is required in production');
      }
      return 'dev-only-weak-secret-change-in-production';
    })()
  });

  // Auth Decorator (legacy - keeping for backward compatibility)
  app.decorate('authenticate', async (request, reply) => {
    try {
      await request.jwtVerify();
    } catch (err) {
      reply.send(err);
    }
  });

  // Register modular API routes
  await app.register(authRoutes, { prefix: '/api' });
  await app.register(generateRoutes, { prefix: '/api' });
  await app.register(projectRoutes, { prefix: '/api' });

  // Health check route
  app.get('/health', async (request, reply) => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  // Centralized Error Handling
  app.setErrorHandler(errorHandler);

  return app;
};

export default buildApp;

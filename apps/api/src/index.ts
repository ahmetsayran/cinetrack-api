import { getStoragePath } from '#core/storage.ts';
import { auth, authSwagger } from '#modules/auth/authentication/plugin';
import cors from '@elysiajs/cors';
import staticPlugin from '@elysiajs/static';
import swagger from '@elysiajs/swagger';
import { createSeederServer } from '@onlyjs/db/seeder/server';
import { Elysia } from 'elysia';
import { loadEnv } from './config/env';
import { handleElysiaError } from './config/error-handler';
import { prepareSwaggerConfig } from './config/swagger.config';
import { setupGracefulShutdown } from './core/graceful-shutdown';
import { ServerInstance } from './core/server-instance';
import routes, { swaggerTags } from './modules';
import { PERMISSIONS } from './modules/auth';

loadEnv();

const seederServer = await createSeederServer({
  silent: true,
});

const app = new Elysia({
  // Websocket configuration should be set in this Elysia instance, others will be ignored
  websocket: {
    perMessageDeflate: {
      compress: 'disable',
      decompress: 'disable',
    },
    sendPings: false,
    idleTimeout: 120,
  },
})
  .use(cors({
    origin: [
      process.env.APP_URL || 'http://localhost:5173',
      'http://127.0.0.1:5173',
      'http://localhost:5174',
      'http://127.0.0.1:5174'
    ],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  }))
  .onError(handleElysiaError)
  .use(
    staticPlugin({
      assets: getStoragePath(),
      prefix: '/storage',
    }),
  )
  .use(routes)
  .group('', (app) =>
    app.guard(authSwagger, (app) =>
      app.use(auth(PERMISSIONS.SYSTEM_ADMINISTRATION.SEED_DATA)).use(seederServer),
    ),
  )
  .listen({
    hostname: process.env.HOSTNAME || 'localhost',
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  });

if (process.env.NODE_ENV === 'development') {
  const swaggerConfig = await prepareSwaggerConfig({ tags: swaggerTags });

  app.use(swagger(swaggerConfig));
}

if (app.server) {
  ServerInstance.server = app.server;
}

console.log(
  `🦊 Elysia is running at ${app.server?.url.protocol}//${app.server?.hostname}:${app.server?.port} in ${process.env.NODE_ENV} mode`,
);

setupGracefulShutdown(app);

export type App = typeof app;

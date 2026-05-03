import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

// ── Intercept MongoDB errors BEFORE NestJS bootstrap ─────────────────────────
// MongoDB auth failures are non-fatal — analytics degrades gracefully.
function isMongoDatabaseError(err: any): boolean {
  return (
    err?.name === 'MongoServerError' ||
    err?.name === 'MongooseServerSelectionError' ||
    err?.name === 'MongoNetworkError' ||
    err?.message?.includes('Authentication failed') ||
    err?.message?.includes('ECONNREFUSED') ||
    err?.message?.includes('connect ETIMEDOUT')
  );
}

process.on('unhandledRejection', (reason: any) => {
  if (isMongoDatabaseError(reason)) {
    console.warn('[MongoDB] Connection failed — analytics features degraded:', reason?.message);
    return; // swallow — don't crash
  }
  console.error('[App] Unhandled rejection:', reason);
});

process.on('uncaughtException', (err: any) => {
  if (isMongoDatabaseError(err)) {
    console.warn('[MongoDB] Uncaught error — analytics features degraded:', err?.message);
    return; // swallow — don't crash
  }
  console.error('[App] Uncaught exception:', err);
  process.exit(1);
});

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 4000);
  const nodeEnv = configService.get<string>('NODE_ENV', 'development');
  const isProduction = nodeEnv === 'production';

  // Security
  app.use(
    helmet({
      contentSecurityPolicy: isProduction,
      crossOriginEmbedderPolicy: isProduction,
    }),
  );
  app.use(compression());
  app.use(cookieParser());

  // CORS — allow multiple origins (local dev + production Vercel)
  const allowedOrigins = [
    configService.get<string>('FRONTEND_URL', 'http://localhost:3000'),
    'http://localhost:3000',
    'https://nexora-deploy-frontend.vercel.app',
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, Postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error(`CORS: origin ${origin} not allowed`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Organization-Id'],
  });

  // API versioning
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // Global prefix for REST endpoints — health is public under /api/v1/health
  app.setGlobalPrefix('api', { exclude: ['/graphql'] });

  // Global pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  // Global filters & interceptors
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor(), new TransformInterceptor());

  // Swagger (non-production)
  if (!isProduction) {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('NexoraGrid API')
      .setDescription('NexoraGrid REST API documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .addTag('auth', 'Authentication endpoints')
      .addTag('users', 'User management')
      .addTag('organizations', 'Organization management')
      .addTag('analytics', 'Analytics & metrics')
      .addTag('ai', 'AI assistant')
      .addTag('billing', 'Billing & subscriptions')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('api/docs', app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  // Graceful shutdown
  app.enableShutdownHooks();

  await app.listen(port);
  console.log(`🚀 NexoraGrid API running on http://localhost:${port}`);
  console.log(`📊 GraphQL Playground: http://localhost:${port}/graphql`);
  if (!isProduction) {
    console.log(`📖 Swagger Docs: http://localhost:${port}/api/docs`);
  }
}

bootstrap().catch((err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});

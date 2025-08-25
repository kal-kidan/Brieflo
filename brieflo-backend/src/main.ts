import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonLoggerService } from './utils/logger/winston-logger.service';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import { rateLimitMiddleware } from './middlewares/rate-limit.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.set('query parser', 'extended');

  // Enable cookie parser middleware
  app.use(cookieParser());
  // Enable rate limiting middleware
  app.use(rateLimitMiddleware);
  // Enable custom CORS middleware

  // const trustedOrigins = process.env.TRUSTED_ORIGINS.split(',');

  app.enableCors({
    origin: process.env.TRUSTED_ORIGINS,
    credentials: true,
  });

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalFilters(
    new AllExceptionsFilter(new WinstonLoggerService(new ConfigService())),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

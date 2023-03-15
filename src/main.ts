import { ClassSerializerInterceptor, HttpStatus, UnprocessableEntityException, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import compression from 'compression';
import RateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';

import { AppModule } from './app.module';
import { HttpExceptionFilterAll } from './filters/all-request.filter';
import { HttpExceptionFilter } from './filters/bad-request.filter';
import { TranslationInterceptor } from './interceptors/translation-interceptor.service';
import { setupSwagger } from './setup-swagger';
import { ApiConfigService } from './shared/services/api-config.service';
import { TranslationService } from './shared/services/translation.service';
import { SharedModule } from './shared/shared.module';

export async function severListener(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, new ExpressAdapter(), { cors: false });
  app.enable('trust proxy');
  app.setGlobalPrefix('/api/v1');
  // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  app.use(helmet());
  app.use((_, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
  });

  app.enableCors({
    allowedHeaders: '*',
    origin: '*',
  });
  app.use(
    RateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100000, // limit each IP to 100 requests per windowMs
    }),
  );
  app.use(compression());
  app.use(morgan('combined'));
  app.enableVersioning();

  const reflector = app.get(Reflector);
  const translation = app.get(TranslationService);

  app.useGlobalFilters(
    new HttpExceptionFilterAll(reflector, translation),
    new HttpExceptionFilter(reflector, translation),
  );

  app.useGlobalInterceptors(new TranslationInterceptor(translation));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  const configService = app.select(SharedModule).get(ApiConfigService);

  // only start nats if it is enabled
  if (configService.natsEnabled) {
    const natsConfig = configService.natsConfig;
    app.connectMicroservice({
      transport: Transport.NATS,
      options: {
        url: `nats://${natsConfig.host}:${natsConfig.port}`,
        queue: 'main_service',
      },
    });

    // eslint-disable-next-line @typescript-eslint/await-thenable
    await app.startAllMicroservices();
  }

  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  const port = configService.appConfig.port;
  await app.listen(port);

  console.info(`Server running on PORT: ${port}`);

  return app;
}

void severListener();

import { NestFactory } from '@nestjs/core';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { initializeTransactionalContext } from 'typeorm-transactional-cls-hooked';
import { IBoot, BOOT } from '@nestcloud/common';

import { AppModule } from './app.module';
import { ISwaggerConfig } from './config/types/swagger';
initializeTransactionalContext();

function setSwagger(
  app: INestApplication,
  { name, version, path }: ISwaggerConfig
) {
  const options = new DocumentBuilder()
    .setTitle(name || 'app')
    .setVersion(version || '0.0.0')
    .addBearerAuth()
    .addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(path || '/docs', app, document);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const boot = app.get<IBoot>(BOOT);

  const swagger: ISwaggerConfig = boot.get('swagger');
  if (swagger.enable) {
    setSwagger(app, swagger);
  }

  const port: number = boot.get<number>('server.port', 3000);
  await app.listen(port);
}

bootstrap();

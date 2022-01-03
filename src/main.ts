import './mixins/helpers/load-config';
// tslint:disable-next-line ordered-imports
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { SentryService } from '@ntegral/nestjs-sentry';
import { AppModule } from './app.module';
import { COIN_NAME } from './mixins/constants';

async function bootstrap(): Promise<void> {
  const prefix = `${COIN_NAME.toLowerCase()}-watcher`
  const logger = new Logger('Main');
  const PORT = parseInt(process.env.PORT, 10) || 3000;
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix(prefix);
  app.useLogger(app.get(SentryService));
  const config = new DocumentBuilder()
    .setTitle(`${COIN_NAME} blockchain watcher`)
    .setDescription(`${COIN_NAME} blockchain watcher microservice`)
    .setVersion('0.0.1')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${prefix}/api`, app, document);
  await app.listen(PORT);
  logger.log(`Service listening port ${PORT}`);
}

// tslint:disable-next-line no-floating-promises
bootstrap();

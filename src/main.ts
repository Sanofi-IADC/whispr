import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import Fastify from 'fastify-compress';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

if (process.env.NODE_ENV !== 'local' && process.env.NODE_ENV !== 'test' && process.env.INSTANA_ENDPOINT_URL) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  require('@instana/collector')();
}

const configService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: configService.getLogLevel() }),
  );
  app.enableCors();
  app.register(Fastify);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();

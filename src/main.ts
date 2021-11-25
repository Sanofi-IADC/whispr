/* eslint-disable import/first */
if (
  process.env.NODE_ENV !== 'local'
  && process.env.NODE_ENV !== 'test'
  && process.env.INSTANA_ENDPOINT_URL
) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
  require('@instana/collector')();
}

import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import Fastify from 'fastify-compress';
import { processRequest } from 'graphql-upload';
import { AppModule } from './app.module';
import { ConfigService } from './config/config.service';

const configService = new ConfigService();

async function bootstrap() {
  const adapter = new FastifyAdapter({ logger: configService.getLogLevel() });
  const fastifyInstance = adapter.getInstance();
  fastifyInstance.addContentTypeParser('multipart', (request, done) => {
    request.isMultipart = true;
    done();
  });

  fastifyInstance.addHook('preValidation', async (request: any, reply) => {
    if (!request.raw.isMultipart) {
      return;
    }
    request.body = await processRequest(request.raw, reply.raw);
  });
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    adapter,
  );
  app.enableCors();
  app.register(Fastify);

  await app.listen(3000, '0.0.0.0');
}
bootstrap();

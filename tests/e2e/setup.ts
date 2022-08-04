import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { processRequest } from 'graphql-upload';
import { AppModule } from '../../src/app.module';

export default global;

beforeAll(async () => {
  try {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    const adapter = new FastifyAdapter();
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
    global.app = moduleRef.createNestApplication<NestFastifyApplication>(adapter);
    await global.app.init();
    await global.app.getHttpAdapter().getInstance().ready();
  } catch (e) {
    setTimeout(() => process.exit(1), 1000); // let display the error message
  }
}, 60 * 60 * 1000); // disable timeout so it doesn't start tests if NestJS doesn't start

afterAll(async () => {
  if (global.app) {
    await Promise.all([global.app.close()]);
  }
});

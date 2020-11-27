import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from '../../src/app.module';

declare global {
  namespace NodeJS {
    interface Global {
      app: INestApplication;
    }
  }
}
export default global;

beforeAll(async () => {
  const moduleRef = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();
  global.app = moduleRef.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(),
  );
  await global.app.init();
  await global.app.getHttpAdapter().getInstance().ready();
});

afterAll(async () => {
  await Promise.all([global.app.close()]);
});

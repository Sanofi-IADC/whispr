import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../../../src/app.module';

describe('HealthController (e2e)', () => {
  let moduleRef: TestingModule;
  let app: NestFastifyApplication;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('Returns healthy status', async () => {
    const res = await request(global.app.getHttpServer()).get('/health');
    expect(res['res'].statusCode).toBe(200); // eslint-disable-line dot-notation
  });
});

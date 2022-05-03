import { NestFastifyApplication } from '@nestjs/platform-fastify';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app.module';
import request from 'supertest';

describe('AppController (e2e)', () => {
  let moduleRef: TestingModule;
  let app: NestFastifyApplication;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication<NestFastifyApplication>();
    await app.init();
  });

  it('/ (GET)', async () => {
    const response = await request(global.app.getHttpServer()).get('/');
    expect(response['res'].statusCode).toEqual(200); // eslint-disable-line
  });
});

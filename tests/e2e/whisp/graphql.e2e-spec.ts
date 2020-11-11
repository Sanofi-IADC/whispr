import { Test } from '@nestjs/testing';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from '../../../src/app.module';

const CREATE_WHISP_GQL = `
mutation createWhisp($whisp: WhispInputType!) {
  createWhisp(whisp: $whisp) {
    _id
  }
}
`;

describe('GRAPHQL WhispModule (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication<NestFastifyApplication>(new FastifyAdapter());
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await Promise.all([app.close()]);
  });

  describe('createWhisp', () => {
    it('should returns a 200 and create a new Whisp and return an id', async () => {
      const result = await request(app.getHttpServer())
        .post('/graphql')
        .send({
          query: CREATE_WHISP_GQL,
          variables: {
            whisp: {},
          },
        });

      expect(result.status).toBe(200);
      expect(result.body).toEqual(
        expect.objectContaining({
          data: { createWhisp: { _id: expect.any(String) } },
        }),
      );
    });
  });
});

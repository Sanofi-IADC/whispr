import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IWhisp } from 'src/interfaces/whisp.interface';
import request from 'supertest';

const CREATE_WHISP_GQL = `
mutation createWhisp($whisp: WhispInputType!) {
  createWhisp(whisp: $whisp) {
    _id
  }
}
`;

const WHISP_TEST_TYPE = 'E2E_TEST';

afterAll(async () => {
  try {
    const model = global.app.get<Model<IWhisp>>(getModelToken('Whisp'));
    await model.deleteMany({ type: WHISP_TEST_TYPE });
  } catch {}
});

describe('GRAPHQL WhispModule (e2e)', () => {
  describe('createWhisp', () => {
    it('should return a 200 and create a new Whisp and return its id', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .send({
          query: CREATE_WHISP_GQL,
          variables: {
            whisp: {
              type: WHISP_TEST_TYPE,
            },
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

import request from 'supertest';
import { AUTH } from '../../testUtils/testingConsts';

const WHISPS_QUERY = `query getWhisps {
                        whispsAuthBeta(limit: 5) {
                          _id
                        }
                      }`;

describe('Authentication E2E tests', () => {
  describe('query whisps', () => {
    it('should return 401 Unauthorized when request is sent with no JWT', async () => {
      const result = await request(global.app.getHttpServer()).post('/graphql').send({
        query: WHISPS_QUERY,
      });
      expect(result.body.errors[0].extensions.response.statusCode).toBe(401);
    });

    it('should respond 401 unauthorised when request is sent with JWT signed with a non-valid key', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${AUTH.JWT_SIGNED_WITH_NON_VALID_SECRET_KEY}`)
        .send({
          query: WHISPS_QUERY,
        });
      expect(result.body.errors[0].extensions.response.statusCode).toBe(401);
    });

    it('should respond 401 unauthorised when request is sent with corrupt JWT', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer xxx${AUTH.JWT_SIGNED_WITH_VALID_SECRET_KEY}`)
        .send({
          query: WHISPS_QUERY,
        });
      expect(result.body.errors[0].extensions.response.statusCode).toBe(401);
    });

    it('should respond successfully when request has JWT signed with valid key', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${AUTH.JWT_SIGNED_WITH_VALID_SECRET_KEY}`)
        .send({
          query: WHISPS_QUERY,
        });
      expect(result.body.error).toBeUndefined();
      expect(result.body.data).toBeTruthy();
    });
  });
});

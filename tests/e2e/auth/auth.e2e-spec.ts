import request from 'supertest';
import { AUTH } from '../../testUtils/testingConsts';
import {
  startAuthServer,
  stopAuthServer,
  getToken,
} from '../../testUtils/auth.helper';

const WHISPS_QUERY = `query getWhisps {
                        whispsAuthBeta(limit: 5) {
                          _id
                        }
                      }`;

describe('Authentication E2E tests', () => {
  describe('query whisps', () => {
    it('should return 401 Unauthorized when request is sent with no JWT', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .send({
          query: WHISPS_QUERY,
        });
      expect(result.body.errors[0].extensions.response.statusCode).toBe(401);
    });

    it('should respond 401 unauthorised when request is sent with JWT signed with a non-valid key', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .set(
          'Authorization',
          `Bearer ${AUTH.JWT_SIGNED_WITH_NON_VALID_SECRET_KEY}`,
        )
        .send({
          query: WHISPS_QUERY,
        });
      expect(result.body.errors[0].extensions.response.statusCode).toBe(401);
    });

    it('should respond 401 unauthorised when request is sent with corrupt JWT', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .set(
          'Authorization',
          `Bearer xxx${AUTH.JWT_SIGNED_WITH_VALID_SECRET_KEY}`,
        )
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

    /**
     * @see {@link https://mestrak.com/blog/testing-secure-apis-by-mocking-jwt-and-jwks-3g8e} for jwks testing approach.
     */
    it('successfully checks a token from a secretOrKeyProvider by connecting tothe JWKS', async () => {
      const jwks = startAuthServer('https://whispr-dev.authtest.com');
      const token = getToken(jwks, 'https://whispr-dev.authtest.com');

      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: WHISPS_QUERY,
        });

      stopAuthServer(jwks);
      expect(result.body.data).toBeTruthy();
    });
  });
});

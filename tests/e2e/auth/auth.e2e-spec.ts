import request from 'supertest';

// JWT signed with key='VALID_SECRET KEY', expires in the year 2999 - the key should be updated before that
const JWT_VALID_SECRET_KEY = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE2NDQwMTE3NTksImV4cCI6MzI0NzUxNjA1ODksImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6Impyb2NrZXRAZXhhbXBsZS5jb20iLCJHaXZlbk5hbWUiOiJKb2hubnkiLCJTdXJuYW1lIjoiUm9ja2V0IiwiRW1haWwiOiJqcm9ja2V0QGV4YW1wbGUuY29tIiwiUm9sZSI6WyJNYW5hZ2VyIiwiUHJvamVjdCBBZG1pbmlzdHJhdG9yIl19.uU2m8A1nz1qYjp_ncDCSxhRmqF-qkQ1Gcs8jo5-vO-o'; // eslint-disable-line max-len
const WHISPS_QUERY = `query getWhisps {
                        whispsAuthBeta(limit: 5) {
                          _id
                        }
                      }`;

describe('Authentication E2E tests', () => {
  describe('query whisps', () => {
    it('should return 401 Unauthorized when request has no JWT', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .send({
          query: WHISPS_QUERY,
        });
      expect(result.body.errors[0].extensions.response.statusCode).toBe(401);
    });

    it('should respond successfully when request has valid JWT signed with valid key', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .set('Authorization', `Bearer ${JWT_VALID_SECRET_KEY}`)
        .send({
          query: WHISPS_QUERY,
        });
      expect(result.body.error).toBeUndefined();
      expect(result.body.data).toBeTruthy();
    });
  });
});

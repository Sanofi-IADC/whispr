import request from 'supertest';

describe('GRAPHQL WhispModule (e2e)', () => {
  describe('createWhisp', () => {
    it('should return 401 Unauthorized when request has no JWT', async () => {
      const result = await request(global.app.getHttpServer())
        .post('/graphql')
        .send({
          query: `query getWhisps {
                            whispsAuthBeta(limit: 5) {
                            _id
                            }
                        }`,
        });
      expect(result.body.errors[0].extensions.response.statusCode).toBe(401);
    });
  });
});

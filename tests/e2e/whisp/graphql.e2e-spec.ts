import request from 'supertest';

const CREATE_WHISP_GQL = `
mutation createWhisp($whisp: WhispInputType!) {
  createWhisp(whisp: $whisp) {
    _id
  }
}
`;

describe('GRAPHQL WhispModule (e2e)', () => {
  describe('createWhisp', () => {
    it('should returns a 200 and create a new Whisp and return an id', async () => {
      const result = await request(global.app.getHttpServer())
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

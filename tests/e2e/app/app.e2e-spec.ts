import request from 'supertest';

describe('AppController (e2e)', () => {
  it('/ (GET)', async () =>
    // has to be disabled as Prettier moves this to new line, maybe a better ESLint config is needed
    // eslint-disable-next-line implicit-arrow-linebreak
    request(global.app.getHttpServer()).get('/').expect(200));

  it('Returns healthy graphQL status', async () => {
    const res = await request(global.app.getHttpServer()).get(
      '/.well-known/apollo/server-health',
    );
    expect(res['res'].statusCode).toBe(200); // eslint-disable-line
  });
});

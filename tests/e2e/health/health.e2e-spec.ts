import request from 'supertest';

describe('AppController (e2e)', () => {
  it('Returns healthy status', async () => {
    const res = await request(global.app.getHttpServer()).get('/health');
    expect(res.res.statusCode).toBe(200);
  });
  it('Returns healthy graphQL status', async () => {
    const res = await request(global.app.getHttpServer()).get('/.well-known/apollo/server-health');
    expect(res.res.statusCode).toBe(200);
  });
});

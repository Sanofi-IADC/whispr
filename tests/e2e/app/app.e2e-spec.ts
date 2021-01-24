import request from 'supertest';

describe('AppController (e2e)', () => {
  it('/ (GET)', async () => request(global.app.getHttpServer()).get('/').expect(200).expect('Hello World!'));
  it('Returns healthy graphQL status', async () => {
    const res = await request(global.app.getHttpServer()).get('/.well-known/apollo/server-health');
    expect(res['res'].statusCode).toBe(200); // eslint-disable-line
  });
});

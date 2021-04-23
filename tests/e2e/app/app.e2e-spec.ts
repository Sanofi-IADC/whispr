import request from 'supertest';

describe('AppController (e2e)', () => {
  it('/ (GET)', async () => {
    const response = await request(global.app.getHttpServer()).get('/');
    expect(response['res'].statusCode).toEqual(200); // eslint-disable-line
  });
});

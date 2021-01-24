import request from 'supertest';

describe('HealthController (e2e)', () => {
  it('Returns healthy status', async () => {
    const res = await request(global.app.getHttpServer()).get('/health');
    expect(res['res'].statusCode).toBe(200); // eslint-disable-line dot-notation
  });
});

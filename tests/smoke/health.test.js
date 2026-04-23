const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');

describe('Smoke - Aplicação', () => {
  it('responde health check', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('ok');
  });
});

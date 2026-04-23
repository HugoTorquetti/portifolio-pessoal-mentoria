const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');

describe('Smoke - Aplicação', () => {
  it('responde health check', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('ok');
  });

  it('disponibiliza contrato OpenAPI em JSON', async () => {
    const response = await request(app).get('/api-docs.json');

    expect(response.status).to.equal(200);
    expect(response.body.openapi).to.equal('3.0.3');
    expect(response.body.info.title).to.equal('Receitas da Vó API');
  });
});

const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');

describe('Smoke - Aplicacao', () => {
  it('responde health check', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).to.equal(200);
    expect(response.body.status).to.equal('ok');
  });

  it('responde health check dentro do tempo esperado', async () => {
    const startedAt = Date.now();
    const response = await request(app).get('/api/health');
    const elapsedTime = Date.now() - startedAt;

    expect(response.status).to.equal(200);
    expect(elapsedTime).to.be.lessThan(1000);
  });

  it('bloqueia verbo HTTP nao implementado em rota conhecida', async () => {
    const response = await request(app).patch('/api/health');

    expect(response.status).to.equal(404);
    expect(response.body.message).to.equal('Recurso nao encontrado.');
  });

  it('disponibiliza contrato OpenAPI em JSON', async () => {
    const response = await request(app).get('/api-docs.json');

    expect(response.status).to.equal(200);
    expect(response.body.openapi).to.equal('3.0.3');
    expect(response.body.info.title).to.equal('Receitas da Vó API');
  });
});

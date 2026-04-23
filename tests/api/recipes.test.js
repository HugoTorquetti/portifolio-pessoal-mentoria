const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');
const { restoreDatabase } = require('../helpers/databaseSnapshot');

async function login(email = 'usuario@receitasdavo.com', password = 'usuario123') {
  const response = await request(app)
    .post('/api/auth/login')
    .send({ email, password });

  return response.body.token;
}

describe('API - Receitas', () => {
  beforeEach(() => {
    restoreDatabase();
  });

  it('exibe apenas prévia da receita para visitante', async () => {
    const response = await request(app).get('/api/recipes/1');

    expect(response.status).to.equal(200);
    expect(response.body.access).to.equal('preview');
    expect(response.body.recipe).to.not.have.property('steps');
  });

  it('exibe receita completa para usuário autenticado', async () => {
    const token = await login();
    const response = await request(app)
      .get('/api/recipes/1')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body.access).to.equal('complete');
    expect(response.body.recipe).to.include.keys([
      'title',
      'summary',
      'successChecklist',
      'steps',
      'expertTip'
    ]);
  });

  it('permite usuário autenticado favoritar receita', async () => {
    const token = await login();
    const response = await request(app)
      .post('/api/recipes/1/favorite')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body.favorites).to.include(1);
  });

  it('permite usuário autenticado comentar receita', async () => {
    const token = await login();
    const response = await request(app)
      .post('/api/recipes/1/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Essa receita lembra minha infância.' });

    expect(response.status).to.equal(201);
    expect(response.body.comment.text).to.equal('Essa receita lembra minha infância.');
  });

  it('permite usuário autenticado avaliar receita', async () => {
    const token = await login();
    const response = await request(app)
      .post('/api/recipes/1/ratings')
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 5 });

    expect(response.status).to.equal(201);
    expect(response.body.rating.value).to.equal(5);
  });
});

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

  it('permite remover receita dos favoritos do próprio usuário', async () => {
    const token = await login();

    await request(app)
      .post('/api/recipes/1/favorite')
      .set('Authorization', `Bearer ${token}`);

    const response = await request(app)
      .delete('/api/recipes/1/favorite')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body.favorites).to.not.include(1);
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

  it('permite autor editar o próprio comentário', async () => {
    const token = await login();
    const commentResponse = await request(app)
      .post('/api/recipes/1/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Comentário original.' });

    const response = await request(app)
      .put(`/api/recipes/1/comments/${commentResponse.body.comment.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Comentário editado.' });

    expect(response.status).to.equal(200);
    expect(response.body.comment.text).to.equal('Comentário editado.');
  });

  it('permite admin editar comentário de outro usuário', async () => {
    const userToken = await login();
    const adminToken = await login('admin@receitasdavo.com', 'admin123');
    const commentResponse = await request(app)
      .post('/api/recipes/1/comments')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ text: 'Comentário do usuário.' });

    const response = await request(app)
      .put(`/api/recipes/1/comments/${commentResponse.body.comment.id}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ text: 'Comentário ajustado pelo admin.' });

    expect(response.status).to.equal(200);
    expect(response.body.comment.text).to.equal('Comentário ajustado pelo admin.');
  });

  it('bloqueia usuário comum de editar comentário de outro usuário', async () => {
    const authorToken = await login();
    const secondUserRegister = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Segunda Guardiã',
        email: 'segunda.guardiao@example.com',
        password: 'senha123'
      });

    const secondUserLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: secondUserRegister.body.user.email,
        password: 'senha123'
      });

    const commentResponse = await request(app)
      .post('/api/recipes/1/comments')
      .set('Authorization', `Bearer ${authorToken}`)
      .send({ text: 'Comentário do autor.' });

    const response = await request(app)
      .put(`/api/recipes/1/comments/${commentResponse.body.comment.id}`)
      .set('Authorization', `Bearer ${secondUserLogin.body.token}`)
      .send({ text: 'Tentativa indevida.' });

    expect(response.status).to.equal(403);
  });

  it('permite autor excluir o próprio comentário', async () => {
    const token = await login();
    const commentResponse = await request(app)
      .post('/api/recipes/1/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({ text: 'Comentário para remover.' });

    const response = await request(app)
      .delete(`/api/recipes/1/comments/${commentResponse.body.comment.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).to.equal(200);
    expect(response.body.message).to.equal('Comentário removido com sucesso.');
  });

  it('permite admin excluir comentário de outro usuário', async () => {
    const userToken = await login();
    const adminToken = await login('admin@receitasdavo.com', 'admin123');
    const commentResponse = await request(app)
      .post('/api/recipes/1/comments')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ text: 'Comentário que será removido.' });

    const response = await request(app)
      .delete(`/api/recipes/1/comments/${commentResponse.body.comment.id}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).to.equal(200);
  });

  it('bloqueia usuário comum de excluir comentário de outro usuário', async () => {
    const authorToken = await login();
    const secondUserRegister = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Terceira Guardiã',
        email: 'terceira.guardiao@example.com',
        password: 'senha123'
      });

    const secondUserLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: secondUserRegister.body.user.email,
        password: 'senha123'
      });

    const commentResponse = await request(app)
      .post('/api/recipes/1/comments')
      .set('Authorization', `Bearer ${authorToken}`)
      .send({ text: 'Comentário protegido.' });

    const response = await request(app)
      .delete(`/api/recipes/1/comments/${commentResponse.body.comment.id}`)
      .set('Authorization', `Bearer ${secondUserLogin.body.token}`);

    expect(response.status).to.equal(403);
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

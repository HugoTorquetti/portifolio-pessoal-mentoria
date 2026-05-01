const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');
const { login, loginAsAdmin, loginAsUser } = require('../helpers/authHelper');
const { restoreDatabase } = require('../helpers/databaseSnapshot');

describe('API - Receitas', () => {
  let userToken;

  beforeEach(async () => {
    restoreDatabase();
    userToken = await loginAsUser();
  });

  describe('GET /api/recipes', () => {
    it('lista receitas ativas', async () => {
      const response = await request(app).get('/api/recipes');

      expect(response.status).to.equal(200);
      expect(response.body.recipes).to.have.length.greaterThan(0);
      expect(response.body.recipes[0]).to.include.keys(['id', 'title', 'category', 'summary']);
    });

    it('filtra receitas por categoria via API', async () => {
      const response = await request(app).get('/api/recipes?category=Bolos');

      expect(response.status).to.equal(200);
      expect(response.body.recipes).to.have.length(1);
      expect(response.body.recipes[0].category).to.equal('Bolos');
    });

    it('busca receitas por termo via API', async () => {
      const response = await request(app).get('/api/recipes?search=domingo');

      expect(response.status).to.equal(200);
      expect(response.body.recipes).to.have.length(1);
      expect(response.body.recipes[0].title).to.equal('Sopa de Legumes de Domingo');
    });
  });

  describe('GET /api/recipes/:id', () => {
    it('exibe apenas previa da receita para visitante', async () => {
      const response = await request(app).get('/api/recipes/1');

      expect(response.status).to.equal(200);
      expect(response.body.access).to.equal('preview');
      expect(response.body.recipe).to.not.have.property('steps');
    });

    it('exibe receita completa para usuario autenticado', async () => {
      const response = await request(app)
        .get('/api/recipes/1')
        .set('Authorization', `Bearer ${userToken}`);

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

    it('retorna 404 ao consultar receita inexistente', async () => {
      const response = await request(app).get('/api/recipes/999');

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('Receita não encontrada.');
    });
  });

  describe('POST /api/recipes/:id/favorite', () => {
    it('permite usuario autenticado favoritar receita', async () => {
      const response = await request(app)
        .post('/api/recipes/1/favorite')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.favorites).to.include(1);
    });

    it('bloqueia favoritar receita sem token', async () => {
      const response = await request(app).post('/api/recipes/1/favorite');

      expect(response.status).to.equal(401);
    });

    it('retorna 404 ao favoritar receita inexistente', async () => {
      const response = await request(app)
        .post('/api/recipes/999/favorite')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('Receita não encontrada.');
    });
  });

  describe('DELETE /api/recipes/:id/favorite', () => {
    it('permite remover receita dos favoritos do proprio usuario', async () => {
      await request(app)
        .post('/api/recipes/1/favorite')
        .set('Authorization', `Bearer ${userToken}`);

      const response = await request(app)
        .delete('/api/recipes/1/favorite')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.favorites).to.not.include(1);
    });

    it('bloqueia remover favorito sem token', async () => {
      const response = await request(app).delete('/api/recipes/1/favorite');

      expect(response.status).to.equal(401);
    });

    it('retorna 404 ao remover favorito de receita inexistente', async () => {
      const response = await request(app)
        .delete('/api/recipes/999/favorite')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('Receita não encontrada.');
    });
  });

  describe('GET /api/me/favorites', () => {
    it('lista favoritos do usuario autenticado', async () => {
      await request(app)
        .post('/api/recipes/1/favorite')
        .set('Authorization', `Bearer ${userToken}`);

      const response = await request(app)
        .get('/api/me/favorites')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.favorites).to.have.length(1);
      expect(response.body.favorites[0].id).to.equal(1);
    });

    it('bloqueia listar favoritos sem token', async () => {
      const response = await request(app).get('/api/me/favorites');

      expect(response.status).to.equal(401);
    });
  });

  describe('POST /api/recipes/:id/comments', () => {
    it('permite usuario autenticado comentar receita', async () => {
      const response = await request(app)
        .post('/api/recipes/1/comments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ text: 'Essa receita lembra minha infancia.' });

      expect(response.status).to.equal(201);
      expect(response.body.comment.text).to.equal('Essa receita lembra minha infancia.');
    });

    it('bloqueia comentario sem token', async () => {
      const response = await request(app)
        .post('/api/recipes/1/comments')
        .send({ text: 'Comentario sem token.' });

      expect(response.status).to.equal(401);
    });

    it('bloqueia comentario vazio', async () => {
      const response = await request(app)
        .post('/api/recipes/1/comments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Comentário é obrigatório.');
    });

    it('retorna 404 ao comentar receita inexistente', async () => {
      const response = await request(app)
        .post('/api/recipes/999/comments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ text: 'Comentario em receita inexistente.' });

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('Receita não encontrada.');
    });
  });

  describe('PUT /api/recipes/:id/comments/:commentId', () => {
    it('permite autor editar o proprio comentario', async () => {
      const commentResponse = await request(app)
        .post('/api/recipes/1/comments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ text: 'Comentario original.' });

      const response = await request(app)
        .put(`/api/recipes/1/comments/${commentResponse.body.comment.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({ text: 'Comentario editado.' });

      expect(response.status).to.equal(200);
      expect(response.body.comment.text).to.equal('Comentario editado.');
    });

    it('permite admin editar comentario de outro usuario', async () => {
      const adminToken = await loginAsAdmin();
      const commentResponse = await request(app)
        .post('/api/recipes/1/comments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ text: 'Comentario do usuario.' });

      const response = await request(app)
        .put(`/api/recipes/1/comments/${commentResponse.body.comment.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ text: 'Comentario ajustado pelo admin.' });

      expect(response.status).to.equal(200);
      expect(response.body.comment.text).to.equal('Comentario ajustado pelo admin.');
    });

    it('bloqueia editar comentario sem token', async () => {
      const response = await request(app)
        .put('/api/recipes/1/comments/1')
        .send({ text: 'Sem token.' });

      expect(response.status).to.equal(401);
    });

    it('bloqueia edicao com texto vazio', async () => {
      const commentResponse = await request(app)
        .post('/api/recipes/1/comments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ text: 'Comentario original.' });

      const response = await request(app)
        .put(`/api/recipes/1/comments/${commentResponse.body.comment.id}`)
        .set('Authorization', `Bearer ${userToken}`)
        .send({});

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Comentário é obrigatório.');
    });

    it('retorna 404 ao editar comentario de receita inexistente', async () => {
      const response = await request(app)
        .put('/api/recipes/999/comments/1')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ text: 'Comentario editado.' });

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('Receita não encontrada.');
    });

    it('retorna 404 ao editar comentario inexistente', async () => {
      const response = await request(app)
        .put('/api/recipes/1/comments/999')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ text: 'Comentario editado.' });

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('Comentário não encontrado.');
    });

    it('bloqueia usuario comum de editar comentario de outro usuario', async () => {
      const secondUserRegister = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Segunda Guardia',
          email: 'segunda.guardiao@example.com',
          password: 'senha123'
        });
      const secondUserToken = await login(secondUserRegister.body.user.email, 'senha123');
      const commentResponse = await request(app)
        .post('/api/recipes/1/comments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ text: 'Comentario do autor.' });

      const response = await request(app)
        .put(`/api/recipes/1/comments/${commentResponse.body.comment.id}`)
        .set('Authorization', `Bearer ${secondUserToken}`)
        .send({ text: 'Tentativa indevida.' });

      expect(response.status).to.equal(403);
    });
  });

  describe('DELETE /api/recipes/:id/comments/:commentId', () => {
    it('permite autor excluir o proprio comentario', async () => {
      const commentResponse = await request(app)
        .post('/api/recipes/1/comments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ text: 'Comentario para remover.' });

      const response = await request(app)
        .delete(`/api/recipes/1/comments/${commentResponse.body.comment.id}`)
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).to.equal(200);
      expect(response.body.message).to.equal('Comentário removido com sucesso.');
    });

    it('permite admin excluir comentario de outro usuario', async () => {
      const adminToken = await loginAsAdmin();
      const commentResponse = await request(app)
        .post('/api/recipes/1/comments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ text: 'Comentario que sera removido.' });

      const response = await request(app)
        .delete(`/api/recipes/1/comments/${commentResponse.body.comment.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).to.equal(200);
    });

    it('bloqueia excluir comentario sem token', async () => {
      const response = await request(app).delete('/api/recipes/1/comments/1');

      expect(response.status).to.equal(401);
    });

    it('retorna 404 ao excluir comentario de receita inexistente', async () => {
      const response = await request(app)
        .delete('/api/recipes/999/comments/1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('Receita não encontrada.');
    });

    it('retorna 404 ao excluir comentario inexistente', async () => {
      const response = await request(app)
        .delete('/api/recipes/1/comments/999')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('Comentário não encontrado.');
    });

    it('bloqueia usuario comum de excluir comentario de outro usuario', async () => {
      const secondUserRegister = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Terceira Guardia',
          email: 'terceira.guardiao@example.com',
          password: 'senha123'
        });
      const secondUserToken = await login(secondUserRegister.body.user.email, 'senha123');
      const commentResponse = await request(app)
        .post('/api/recipes/1/comments')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ text: 'Comentario protegido.' });

      const response = await request(app)
        .delete(`/api/recipes/1/comments/${commentResponse.body.comment.id}`)
        .set('Authorization', `Bearer ${secondUserToken}`);

      expect(response.status).to.equal(403);
    });
  });

  describe('POST /api/recipes/:id/ratings', () => {
    it('permite usuario autenticado avaliar receita', async () => {
      const response = await request(app)
        .post('/api/recipes/1/ratings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ value: 5 });

      expect(response.status).to.equal(201);
      expect(response.body.rating.value).to.equal(5);
    });

    it('bloqueia avaliacao sem token', async () => {
      const response = await request(app)
        .post('/api/recipes/1/ratings')
        .send({ value: 5 });

      expect(response.status).to.equal(401);
    });

    it('bloqueia avaliacao invalida', async () => {
      const response = await request(app)
        .post('/api/recipes/1/ratings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ value: 6 });

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Avaliação deve ser um número inteiro entre 1 e 5.');
    });

    it('retorna 404 ao avaliar receita inexistente', async () => {
      const response = await request(app)
        .post('/api/recipes/999/ratings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ value: 5 });

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('Receita não encontrada.');
    });
  });
});

const request = require('supertest');
const { expect } = require('chai');
const app = require('../../src/app');
const { loginAsAdmin, loginAsUser } = require('../helpers/authHelper');
const { restoreDatabase } = require('../helpers/databaseSnapshot');
const validRecipe = require('../fixtures/validRecipe.json');

describe('API - Administracao de receitas', () => {
  let adminToken;

  beforeEach(async () => {
    restoreDatabase();
    adminToken = await loginAsAdmin();
  });

  describe('POST /api/recipes', () => {
    it('permite admin publicar receita', async () => {
      const response = await request(app)
        .post('/api/recipes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validRecipe);

      expect(response.status).to.equal(201);
      expect(response.body.recipe).to.deep.include(validRecipe);
    });

    it('bloqueia publicacao sem token', async () => {
      const response = await request(app)
        .post('/api/recipes')
        .send(validRecipe);

      expect(response.status).to.equal(401);
      expect(response.body.message).to.equal('Autenticação obrigatória.');
    });

    it('bloqueia publicacao com payload incompleto', async () => {
      const response = await request(app)
        .post('/api/recipes')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Receita incompleta' });

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Todos os campos obrigatórios da receita devem ser informados.');
    });

    it('bloqueia usuario comum de publicar receita', async () => {
      const userToken = await loginAsUser();
      const response = await request(app)
        .post('/api/recipes')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validRecipe);

      expect(response.status).to.equal(403);
    });
  });

  describe('PUT /api/recipes/:id', () => {
    it('permite admin substituir receita completa com PUT', async () => {
      const response = await request(app)
        .put('/api/recipes/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          ...validRecipe,
          title: 'Bolo de Fuba Atualizado'
        });

      expect(response.status).to.equal(200);
      expect(response.body.recipe.title).to.equal('Bolo de Fuba Atualizado');
    });

    it('bloqueia PUT sem token', async () => {
      const response = await request(app)
        .put('/api/recipes/1')
        .send(validRecipe);

      expect(response.status).to.equal(401);
    });

    it('exige receita completa ao atualizar com PUT', async () => {
      const response = await request(app)
        .put('/api/recipes/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Bolo de Fuba Atualizado' });

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Todos os campos obrigatórios da receita devem ser informados.');
    });

    it('retorna 404 ao substituir receita inexistente com PUT', async () => {
      const response = await request(app)
        .put('/api/recipes/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(validRecipe);

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('Receita não encontrada.');
    });

    it('bloqueia usuario comum de substituir receita com PUT', async () => {
      const userToken = await loginAsUser();
      const response = await request(app)
        .put('/api/recipes/1')
        .set('Authorization', `Bearer ${userToken}`)
        .send(validRecipe);

      expect(response.status).to.equal(403);
    });
  });

  describe('PATCH /api/recipes/:id', () => {
    it('permite admin atualizar parcialmente receita com PATCH', async () => {
      const beforeResponse = await request(app)
        .get('/api/recipes/1')
        .set('Authorization', `Bearer ${adminToken}`);

      const response = await request(app)
        .patch('/api/recipes/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          successChecklist: [
            'Separe os ingredientes em temperatura ambiente.',
            'Preaqueça o forno antes de começar.'
          ]
        });

      expect(response.status).to.equal(200);
      expect(response.body.recipe.successChecklist).to.deep.equal([
        'Separe os ingredientes em temperatura ambiente.',
        'Preaqueça o forno antes de começar.'
      ]);
      expect(response.body.recipe.title).to.equal(beforeResponse.body.recipe.title);
      expect(response.body.recipe.summary).to.equal(beforeResponse.body.recipe.summary);
    });

    it('permite admin atualizar somente o titulo da receita com PATCH', async () => {
      const response = await request(app)
        .patch('/api/recipes/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Bolo de Fuba com Titulo Corrigido' });

      expect(response.status).to.equal(200);
      expect(response.body.recipe.title).to.equal('Bolo de Fuba com Titulo Corrigido');
      expect(response.body.recipe.category).to.equal('Bolos');
      expect(response.body.recipe.steps).to.have.length.greaterThan(0);
    });

    it('bloqueia PATCH sem token', async () => {
      const response = await request(app)
        .patch('/api/recipes/1')
        .send({ title: 'Tentativa sem token' });

      expect(response.status).to.equal(401);
    });

    it('bloqueia PATCH sem campos validos de receita', async () => {
      const response = await request(app)
        .patch('/api/recipes/1')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ id: 99 });

      expect(response.status).to.equal(400);
      expect(response.body.message).to.equal('Informe ao menos um campo válido da receita para atualizar.');
      expect(response.body.allowedFields).to.include('title');
    });

    it('retorna 404 ao atualizar parcialmente receita inexistente com PATCH', async () => {
      const response = await request(app)
        .patch('/api/recipes/999')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ title: 'Receita inexistente' });

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('Receita não encontrada.');
    });

    it('bloqueia usuario comum de atualizar parcialmente receita com PATCH', async () => {
      const userToken = await loginAsUser();
      const response = await request(app)
        .patch('/api/recipes/1')
        .set('Authorization', `Bearer ${userToken}`)
        .send({ title: 'Tentativa indevida' });

      expect(response.status).to.equal(403);
    });
  });

  describe('DELETE /api/recipes/:id', () => {
    it('permite admin excluir receita com soft delete', async () => {
      const deleteResponse = await request(app)
        .delete('/api/recipes/1')
        .set('Authorization', `Bearer ${adminToken}`);

      const listResponse = await request(app).get('/api/recipes');
      const detailsResponse = await request(app).get('/api/recipes/1');

      expect(deleteResponse.status).to.equal(200);
      expect(deleteResponse.body.recipe.deletedAt).to.be.a('string');
      expect(listResponse.body.recipes.map((recipe) => recipe.id)).to.not.include(1);
      expect(detailsResponse.status).to.equal(404);
    });

    it('bloqueia DELETE sem token', async () => {
      const response = await request(app).delete('/api/recipes/1');

      expect(response.status).to.equal(401);
    });

    it('retorna 404 ao excluir receita inexistente', async () => {
      const response = await request(app)
        .delete('/api/recipes/999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('Receita não encontrada.');
    });

    it('bloqueia usuario comum de excluir receita', async () => {
      const userToken = await loginAsUser();
      const response = await request(app)
        .delete('/api/recipes/1')
        .set('Authorization', `Bearer ${userToken}`);

      expect(response.status).to.equal(403);
    });
  });
});

const { Router } = require('express');
const { optionalAuth, requireAuth } = require('../middlewares/auth');
const { loginUser, registerUser } = require('../services/authService');
const {
  addComment,
  addRating,
  createRecipe,
  favoriteRecipe,
  getRecipeDetails,
  listFavorites,
  listRecipes,
  softDeleteRecipe,
  updateRecipe
} = require('../services/recipeService');

function sendServiceResponse(res, result) {
  return res.status(result.status).json(result.body);
}

function createApiRouter() {
  const router = Router();

  router.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok', app: 'Receitas da Vó' });
  });

  router.post('/auth/register', (req, res) => {
    return sendServiceResponse(res, registerUser(req.body));
  });

  router.post('/auth/login', (req, res) => {
    return sendServiceResponse(res, loginUser(req.body));
  });

  router.get('/recipes', (req, res) => {
    res.status(200).json({ recipes: listRecipes(req.query) });
  });

  router.get('/recipes/:id', optionalAuth, (req, res) => {
    return sendServiceResponse(res, getRecipeDetails(req.params.id, req.user));
  });

  router.post('/recipes', requireAuth, (req, res) => {
    return sendServiceResponse(res, createRecipe(req.user, req.body));
  });

  router.put('/recipes/:id', requireAuth, (req, res) => {
    return sendServiceResponse(res, updateRecipe(req.user, req.params.id, req.body));
  });

  router.delete('/recipes/:id', requireAuth, (req, res) => {
    return sendServiceResponse(res, softDeleteRecipe(req.user, req.params.id));
  });

  router.post('/recipes/:id/favorite', requireAuth, (req, res) => {
    return sendServiceResponse(res, favoriteRecipe(req.params.id, req.user));
  });

  router.get('/me/favorites', requireAuth, (req, res) => {
    return sendServiceResponse(res, listFavorites(req.user));
  });

  router.post('/recipes/:id/comments', requireAuth, (req, res) => {
    return sendServiceResponse(res, addComment(req.params.id, req.user, req.body.text));
  });

  router.post('/recipes/:id/ratings', requireAuth, (req, res) => {
    return sendServiceResponse(res, addRating(req.params.id, req.user, req.body.value));
  });

  return router;
}

module.exports = {
  createApiRouter
};

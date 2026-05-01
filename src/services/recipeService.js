const { readDatabase, writeDatabase } = require('../data/db');

function isActiveRecipe(recipe) {
  return !recipe.deletedAt;
}

function findActiveRecipeById(database, recipeId) {
  return database.recipes.find((item) => item.id === Number(recipeId) && isActiveRecipe(item));
}

function findComment(recipe, commentId) {
  return recipe.comments.find((comment) => comment.id === Number(commentId));
}

function canManageComment(user, comment) {
  return user.role === 'admin' || comment.userId === user.id;
}

const REQUIRED_RECIPE_FIELDS = ['title', 'category', 'summary', 'successChecklist', 'steps', 'expertTip'];
const UPDATABLE_RECIPE_FIELDS = REQUIRED_RECIPE_FIELDS;

function pickRecipeFields(recipePayload) {
  return UPDATABLE_RECIPE_FIELDS.reduce((payload, field) => {
    if (Object.prototype.hasOwnProperty.call(recipePayload, field)) {
      payload[field] = recipePayload[field];
    }

    return payload;
  }, {});
}

function hasMissingRequiredRecipeField(recipePayload) {
  return REQUIRED_RECIPE_FIELDS.some((field) => !recipePayload[field]);
}

function getRecipePreview(recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    category: recipe.category,
    summary: recipe.summary
  };
}

function listRecipes({ search, category }) {
  const database = readDatabase();
  const normalizedSearch = search ? search.toLowerCase() : '';
  const normalizedCategory = category ? category.toLowerCase() : '';

  return database.recipes
    .filter((recipe) => {
      if (!isActiveRecipe(recipe)) {
        return false;
      }

      const matchesSearch = !normalizedSearch
        || recipe.title.toLowerCase().includes(normalizedSearch)
        || recipe.summary.toLowerCase().includes(normalizedSearch);
      const matchesCategory = !normalizedCategory
        || recipe.category.toLowerCase() === normalizedCategory;

      return matchesSearch && matchesCategory;
    })
    .map(getRecipePreview);
}

function getRecipeDetails(recipeId, user) {
  const database = readDatabase();
  const recipe = findActiveRecipeById(database, recipeId);

  if (!recipe) {
    return { status: 404, body: { message: 'Receita não encontrada.' } };
  }

  if (!user) {
    return {
      status: 200,
      body: {
        recipe: getRecipePreview(recipe),
        access: 'preview',
        message: 'Faça login ou cadastro para acessar a receita completa.'
      }
    };
  }

  return {
    status: 200,
    body: {
      recipe,
      access: 'complete'
    }
  };
}

function favoriteRecipe(recipeId, user) {
  const database = readDatabase();
  const recipe = findActiveRecipeById(database, recipeId);
  const persistedUser = database.users.find((item) => item.id === user.id);

  if (!recipe) {
    return { status: 404, body: { message: 'Receita não encontrada.' } };
  }

  if (!persistedUser.favorites.includes(recipe.id)) {
    persistedUser.favorites.push(recipe.id);
  }

  writeDatabase(database);

  return { status: 200, body: { favorites: persistedUser.favorites } };
}

function removeFavoriteRecipe(recipeId, user) {
  const database = readDatabase();
  const recipe = findActiveRecipeById(database, recipeId);
  const persistedUser = database.users.find((item) => item.id === user.id);

  if (!recipe) {
    return { status: 404, body: { message: 'Receita não encontrada.' } };
  }

  persistedUser.favorites = persistedUser.favorites.filter((favoriteId) => favoriteId !== recipe.id);
  writeDatabase(database);

  return { status: 200, body: { favorites: persistedUser.favorites } };
}

function listFavorites(user) {
  const database = readDatabase();
  const persistedUser = database.users.find((item) => item.id === user.id);
  const favorites = database.recipes
    .filter((recipe) => persistedUser.favorites.includes(recipe.id) && isActiveRecipe(recipe))
    .map(getRecipePreview);

  return { status: 200, body: { favorites } };
}

function addComment(recipeId, user, text) {
  if (!text) {
    return { status: 400, body: { message: 'Comentário é obrigatório.' } };
  }

  const database = readDatabase();
  const recipe = findActiveRecipeById(database, recipeId);

  if (!recipe) {
    return { status: 404, body: { message: 'Receita não encontrada.' } };
  }

  const comment = {
    id: Date.now(),
    userId: user.id,
    userName: user.name,
    text
  };

  recipe.comments.push(comment);
  writeDatabase(database);

  return { status: 201, body: { comment } };
}

function updateComment(recipeId, commentId, user, text) {
  if (!text) {
    return { status: 400, body: { message: 'Comentário é obrigatório.' } };
  }

  const database = readDatabase();
  const recipe = findActiveRecipeById(database, recipeId);

  if (!recipe) {
    return { status: 404, body: { message: 'Receita não encontrada.' } };
  }

  const comment = findComment(recipe, commentId);

  if (!comment) {
    return { status: 404, body: { message: 'Comentário não encontrado.' } };
  }

  if (!canManageComment(user, comment)) {
    return { status: 403, body: { message: 'Somente o autor do comentário ou admin pode editar comentários.' } };
  }

  comment.text = text;
  writeDatabase(database);

  return { status: 200, body: { comment } };
}

function deleteComment(recipeId, commentId, user) {
  const database = readDatabase();
  const recipe = findActiveRecipeById(database, recipeId);

  if (!recipe) {
    return { status: 404, body: { message: 'Receita não encontrada.' } };
  }

  const comment = findComment(recipe, commentId);

  if (!comment) {
    return { status: 404, body: { message: 'Comentário não encontrado.' } };
  }

  if (!canManageComment(user, comment)) {
    return { status: 403, body: { message: 'Somente o autor do comentário ou admin pode excluir comentários.' } };
  }

  recipe.comments = recipe.comments.filter((item) => item.id !== Number(commentId));
  writeDatabase(database);

  return { status: 200, body: { message: 'Comentário removido com sucesso.' } };
}

function addRating(recipeId, user, value) {
  if (!Number.isInteger(value) || value < 1 || value > 5) {
    return { status: 400, body: { message: 'Avaliação deve ser um número inteiro entre 1 e 5.' } };
  }

  const database = readDatabase();
  const recipe = findActiveRecipeById(database, recipeId);

  if (!recipe) {
    return { status: 404, body: { message: 'Receita não encontrada.' } };
  }

  const rating = {
    id: Date.now(),
    userId: user.id,
    value
  };

  recipe.ratings.push(rating);
  writeDatabase(database);

  return { status: 201, body: { rating } };
}

function createRecipe(user, recipePayload) {
  if (user.role !== 'admin') {
    return { status: 403, body: { message: 'Somente admin pode publicar receitas.' } };
  }

  if (hasMissingRequiredRecipeField(recipePayload)) {
    return { status: 400, body: { message: 'Todos os campos obrigatórios da receita devem ser informados.' } };
  }

  const database = readDatabase();
  const recipe = {
    id: Date.now(),
    ...recipePayload,
    deletedAt: null,
    comments: [],
    ratings: []
  };

  database.recipes.push(recipe);
  writeDatabase(database);

  return { status: 201, body: { recipe } };
}

function updateRecipe(user, recipeId, recipePayload) {
  if (user.role !== 'admin') {
    return { status: 403, body: { message: 'Somente admin pode editar receitas.' } };
  }

  if (hasMissingRequiredRecipeField(recipePayload)) {
    return { status: 400, body: { message: 'Todos os campos obrigatórios da receita devem ser informados.' } };
  }

  const database = readDatabase();
  const recipeIndex = database.recipes.findIndex(
    (item) => item.id === Number(recipeId) && isActiveRecipe(item)
  );

  if (recipeIndex === -1) {
    return { status: 404, body: { message: 'Receita não encontrada.' } };
  }

  database.recipes[recipeIndex] = {
    ...database.recipes[recipeIndex],
    ...recipePayload,
    id: database.recipes[recipeIndex].id,
    deletedAt: database.recipes[recipeIndex].deletedAt
  };

  writeDatabase(database);

  return { status: 200, body: { recipe: database.recipes[recipeIndex] } };
}

function patchRecipe(user, recipeId, recipePayload) {
  if (user.role !== 'admin') {
    return { status: 403, body: { message: 'Somente admin pode editar receitas.' } };
  }

  const partialPayload = pickRecipeFields(recipePayload);

  if (Object.keys(partialPayload).length === 0) {
    return {
      status: 400,
      body: {
        message: 'Informe ao menos um campo válido da receita para atualizar.',
        allowedFields: UPDATABLE_RECIPE_FIELDS
      }
    };
  }

  const database = readDatabase();
  const recipeIndex = database.recipes.findIndex(
    (item) => item.id === Number(recipeId) && isActiveRecipe(item)
  );

  if (recipeIndex === -1) {
    return { status: 404, body: { message: 'Receita não encontrada.' } };
  }

  database.recipes[recipeIndex] = {
    ...database.recipes[recipeIndex],
    ...partialPayload,
    id: database.recipes[recipeIndex].id,
    deletedAt: database.recipes[recipeIndex].deletedAt
  };

  writeDatabase(database);

  return { status: 200, body: { recipe: database.recipes[recipeIndex] } };
}

function softDeleteRecipe(user, recipeId) {
  if (user.role !== 'admin') {
    return { status: 403, body: { message: 'Somente admin pode excluir receitas.' } };
  }

  const database = readDatabase();
  const recipeIndex = database.recipes.findIndex(
    (item) => item.id === Number(recipeId) && isActiveRecipe(item)
  );

  if (recipeIndex === -1) {
    return { status: 404, body: { message: 'Receita não encontrada.' } };
  }

  database.recipes[recipeIndex] = {
    ...database.recipes[recipeIndex],
    deletedAt: new Date().toISOString()
  };

  writeDatabase(database);

  return {
    status: 200,
    body: {
      message: 'Receita removida com soft delete.',
      recipe: database.recipes[recipeIndex]
    }
  };
}

module.exports = {
  addComment,
  addRating,
  createRecipe,
  deleteComment,
  favoriteRecipe,
  getRecipeDetails,
  isActiveRecipe,
  listFavorites,
  listRecipes,
  patchRecipe,
  removeFavoriteRecipe,
  softDeleteRecipe,
  updateComment,
  updateRecipe
};

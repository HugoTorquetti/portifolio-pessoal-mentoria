const { getAuthenticatedUser } = require('../services/authService');

function optionalAuth(req, _res, next) {
  req.user = getAuthenticatedUser(req.headers.authorization);
  next();
}

function requireAuth(req, res, next) {
  const user = getAuthenticatedUser(req.headers.authorization);

  if (!user) {
    return res.status(401).json({ message: 'Autenticação obrigatória.' });
  }

  req.user = user;
  return next();
}

module.exports = {
  optionalAuth,
  requireAuth
};

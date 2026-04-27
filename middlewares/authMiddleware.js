const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

/**
 * Vérifie la validité du token JWT dans les headers.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @throws {AppError} 401 si absent, 403 si invalide.
 */
const verifierToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    throw new AppError("Accès refusé. Token manquant.", 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    throw new AppError("Token invalide ou expiré.", 403);
  }
};

/**
 * Restreint l'accès aux rôles spécifiés.
 * 
 * @param {...string} rolesAutorises 
 * @returns {import('express').RequestHandler}
 */
const autoriserRoles = (...rolesAutorises) => {
  return (req, res, next) => {
    if (!rolesAutorises.includes(req.user.role)) {
      throw new AppError(
        "Accès interdit. Votre rôle (" +
          req.user.role +
          ") ne permet pas d'effectuer cette action.",
        403,
      );
    }
    next();
  };
};

module.exports = { verifierToken, autoriserRoles };


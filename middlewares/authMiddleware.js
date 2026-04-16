const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

/**
 * @module middlewares/authMiddleware
 * @description Middleware pour protéger les routes de l'API via JWT et gestion des rôles.
 */

/**
 * Vérifie la présence et la validité du token JWT dans le header `Authorization: Bearer <token>`.
 *
 * @function verifierToken
 * @param {import('express').Request} req - L'objet de requête Express.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {void} Passe au middleware suivant si valide.
 * @throws {AppError} 401 - Si le token est manquant.
 * @throws {AppError} 403 - Si le token est invalide ou expiré.
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
 * Filtre l'accès selon le ou les rôles de l'utilisateur.
 * Doit être utilisé APRÈS le middleware `verifierToken`.
 *
 * @function autoriserRoles
 * @param {...string} rolesAutorises - Liste des rôles autorisés (ex: 'Proviseur', 'Secretariat').
 * @returns {import('express').RequestHandler} Middleware Express de filtrage par rôle.
 * @throws {AppError} 403 - Si le rôle de l'utilisateur n'est pas autorisé.
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

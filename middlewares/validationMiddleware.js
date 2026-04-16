const { validationResult } = require("express-validator");
const AppError = require("../utils/appError");

/**
 * @module middlewares/validationMiddleware
 * @description Middleware pour vérifier et traiter les résultats de validation d'express-validator.
 */

/**
 * Intercepte les erreurs de validation et lance une AppError en cas d'échec.
 * À placer après les règles de validation et avant le contrôleur.
 *
 * @function validerRequete
 * @param {import('express').Request} req - L'objet de requête Express.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {void} Passe au middleware suivant si valide.
 * @throws {AppError} 422 - Avec le détail des champs invalides.
 */
const validerRequete = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = errors
      .array()
      .map((e) => ({ champ: e.path, message: e.msg }));

    const error = new AppError("Données de requête invalides.", 422);
    error.errors = validationErrors; // On attache les détails à l'objet error
    return next(error);
  }
  next();
};

module.exports = { validerRequete };

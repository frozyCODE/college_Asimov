const { validationResult } = require("express-validator");
const AppError = require("../utils/appError");

/**
 * Intercepte et traite les erreurs de l'express-validator.
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @throws {AppError} 422 si les données sont invalides.
 */
const validerRequete = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const validationErrors = errors
      .array()
      .map((e) => ({ champ: e.path, message: e.msg }));

    const error = new AppError("Données de requête invalides.", 422);
    error.errors = validationErrors;
    return next(error);
  }
  next();
};

module.exports = { validerRequete };


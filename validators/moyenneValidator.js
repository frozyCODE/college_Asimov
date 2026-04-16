const { body } = require("express-validator");

/**
 * @module validators/moyenneValidator
 * @description Validations pour l'enregistrement des notes et moyennes semestrielles.
 */

/**
 * Règles pour POST /api/moyennes (ajouter une moyenne).
 * @constant {Array} createMoyenneValidator
 */
const createMoyenneValidator = [
  body("inscription_id")
    .notEmpty()
    .withMessage("L'ID de l'inscription est requis.")
    .isInt({ min: 1 })
    .withMessage("L'ID de l'inscription doit être un entier positif."),
  body("semestre")
    .notEmpty()
    .withMessage("Le semestre est requis.")
    .isIn([1, 2])
    .withMessage("Le semestre doit être 1 ou 2."),
  body("moyenne_generale")
    .notEmpty()
    .withMessage("La moyenne générale est requise.")
    .isFloat({ min: 0, max: 20 })
    .withMessage("La moyenne doit être entre 0 et 20."),
];

module.exports = { createMoyenneValidator };

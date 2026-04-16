const { body } = require("express-validator");

/**
 * @module validators/optionValidator
 * @description Validations pour la gestion du catalogue d'options et les inscriptions d'élèves.
 */

/**
 * Règles pour POST /api/options (créer une option).
 * @constant {Array} createOptionValidator
 */
const createOptionValidator = [
  body("nom").trim().notEmpty().withMessage("Le nom de l'option est requis."),
];

/**
 * Règles pour POST /api/options/choisir (assigner une option à un élève).
 * @constant {Array} assignOptionValidator
 */
const assignOptionValidator = [
  body("eleve_id")
    .notEmpty()
    .withMessage("L'ID de l'élève est requis.")
    .isInt({ min: 1 })
    .withMessage("L'ID de l'élève doit être un entier positif."),
  body("option_id")
    .notEmpty()
    .withMessage("L'ID de l'option est requis.")
    .isInt({ min: 1 })
    .withMessage("L'ID de l'option doit être un entier positif."),
];

module.exports = { createOptionValidator, assignOptionValidator };

const { body } = require("express-validator");

/**
 * Validations pour la gestion des options.
 */
const createOptionValidator = [
  body("nom").trim().notEmpty().withMessage("Le nom de l'option est requis."),
];

/**
 * Validations pour l'assignation d'une option.
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


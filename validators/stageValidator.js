const { body } = require("express-validator");

/**
 * @module validators/stageValidator
 * @description Validations pour le suivi des démarches de stage.
 */

/**
 * Règles pour POST /api/stages/recherches (ajouter une recherche de stage).
 * @constant {Array} createRechercheValidator
 */
const createRechercheValidator = [
  body("eleve_id")
    .notEmpty()
    .withMessage("L'ID de l'élève est requis.")
    .isInt({ min: 1 })
    .withMessage("L'ID de l'élève doit être un entier positif."),
  body("nom_entreprise")
    .trim()
    .notEmpty()
    .withMessage("Le nom de l'entreprise est requis."),
];

module.exports = { createRechercheValidator };

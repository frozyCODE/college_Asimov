const { body } = require("express-validator");

/**
 * Validations pour l'ajout d'une recherche de stage.
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


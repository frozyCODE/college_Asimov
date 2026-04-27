const { body } = require("express-validator");

/**
 * Validations pour la création d'un parent.
 */
const createParentValidator = [
  body("nom").trim().notEmpty().withMessage("Le nom est requis."),
  body("prenom").trim().notEmpty().withMessage("Le prénom est requis."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("L'email est requis.")
    .isEmail()
    .withMessage("L'email doit être valide."),
  body("password")
    .notEmpty()
    .withMessage("Le mot de passe est requis.")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit faire au moins 6 caractères."),
];

/**
 * Validations pour la liaison parent-élève.
 */
const lierParentValidator = [
  body("eleve_id")
    .notEmpty()
    .withMessage("L'ID de l'élève est requis.")
    .isInt({ min: 1 })
    .withMessage("L'ID de l'élève doit être un entier positif."),
  body("parent_id")
    .notEmpty()
    .withMessage("L'ID du parent est requis.")
    .isInt({ min: 1 })
    .withMessage("L'ID du parent doit être un entier positif."),
];

module.exports = { createParentValidator, lierParentValidator };


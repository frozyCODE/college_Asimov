const { body } = require("express-validator");

/**
 * @module validators/professeurValidator
 * @description Validations pour les profils enseignants.
 */

/**
 * Règles pour POST /api/professeurs.
 * @constant {Array} createProfesseurValidator
 */
const createProfesseurValidator = [
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
 * Règles pour PUT /api/professeurs/:id.
 * @constant {Array} updateProfesseurValidator
 */
const updateProfesseurValidator = [
  body("nom").trim().notEmpty().withMessage("Le nom est requis."),
  body("prenom").trim().notEmpty().withMessage("Le prénom est requis."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("L'email est requis.")
    .isEmail()
    .withMessage("L'email doit être valide."),
];

module.exports = { createProfesseurValidator, updateProfesseurValidator };

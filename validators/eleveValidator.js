const { body } = require("express-validator");

/**
 * @module validators/eleveValidator
 * @description Validations pour la gestion des profils élèves.
 */

/**
 * Règles communes de base pour un utilisateur (appliquées aux élèves).
 * @constant {Array} baseUtilisateurRules
 */
const baseUtilisateurRules = [
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
 * Règles pour POST /api/eleves (création d'un élève).
 * @constant {Array} createEleveValidator
 */
const createEleveValidator = [
  ...baseUtilisateurRules,
  body("identifiant_csv")
    .optional()
    .trim()
    .isString()
    .withMessage("L'identifiant CSV doit être une chaîne de caractères."),
];

/**
 * Règles pour PUT /api/eleves/:id (modification d'un élève).
 * @constant {Array} updateEleveValidator
 */
const updateEleveValidator = [
  body("nom").trim().notEmpty().withMessage("Le nom est requis."),
  body("prenom").trim().notEmpty().withMessage("Le prénom est requis."),
  body("email")
    .trim()
    .notEmpty()
    .withMessage("L'email est requis.")
    .isEmail()
    .withMessage("L'email doit être valide."),
];

module.exports = { createEleveValidator, updateEleveValidator };

const { body } = require("express-validator");

/**
 * Règles de base pour un utilisateur.
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
 * Validations pour la création d'un élève.
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
 * Validations pour la modification d'un élève.
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


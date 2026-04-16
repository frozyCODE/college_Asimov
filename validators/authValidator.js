const { body } = require("express-validator");

/**
 * @module validators/authValidator
 * @description Validations pour l'authentification et les jetons d'accès.
 */

/**
 * Règles de validation pour la route POST /api/auth/login.
 * @constant {Array} loginValidator
 */
const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("L'email est requis.")
    .isEmail()
    .withMessage("L'email doit être valide."),
  body("password")
    .notEmpty()
    .withMessage("Le mot de passe est requis.")
    .isLength({ min: 4 })
    .withMessage("Le mot de passe doit faire au moins 4 caractères."),
];

module.exports = { loginValidator };

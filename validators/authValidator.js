const { body } = require("express-validator");

/**
 * Validations pour l'authentification.
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


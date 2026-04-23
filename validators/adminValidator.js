const { body } = require("express-validator");

/**
 * Validations pour la création de comptes administratifs.
 */
const createAdminValidator = [
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
  body("role")
    .notEmpty()
    .withMessage("Le rôle est requis.")
    .isIn(["Proviseur", "Secretariat"])
    .withMessage("Le rôle doit être 'Proviseur' ou 'Secretariat'."),
];

module.exports = { createAdminValidator };


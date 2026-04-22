const { body } = require("express-validator");

const createMoyenneValidator = [
  body("inscription_id")
    .notEmpty()
    .withMessage("L'ID de l'inscription est obligatoire.")
    .isInt()
    .withMessage("L'ID de l'inscription doit être un entier."),

  body("semestre")
    .notEmpty()
    .withMessage("Le semestre est obligatoire.")
    .isInt({ min: 1, max: 2 })
    .withMessage("Le semestre doit être 1 ou 2."),

  body("moyenne_generale")
    .notEmpty()
    .withMessage("La moyenne est obligatoire.")
    .isFloat({ min: 0, max: 20 })
    .withMessage("La moyenne doit être comprise entre 0 et 20."),
];

module.exports = { createMoyenneValidator };

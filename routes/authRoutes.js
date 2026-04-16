const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { loginValidator } = require("../validators/authValidator");
const { validerRequete } = require("../middlewares/validationMiddleware");

/**
 * @module routes/authRoutes
 * @description Routes pour l'authentification des utilisateurs.
 */

/**
 * @route POST /api/auth/login
 * @group Authentification - Login
 * @access Public
 * @param {string} email.body.required - Email de l'utilisateur
 * @param {string} password.body.required - Mot de passe
 * @returns {Object} 200 - Token JWT et infos utilisateur
 * @returns {Error} 401 - Identifiants invalides
 * @returns {Error} 500 - Erreur serveur
 */
router.post("/login", loginValidator, validerRequete, authController.login);

module.exports = router;

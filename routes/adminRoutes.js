const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");
const { createAdminValidator } = require("../validators/adminValidator");
const { validerRequete } = require("../middlewares/validationMiddleware");

/**
 * @module routes/adminRoutes
 * @description Routes administratives pour la gestion des utilisateurs.
 */

/**
 * @route POST /api/admin/utilisateurs
 * @group Admin - Opérations administratives
 * @access Privat - Seul Proviseur
 * @param {Object} body.body - Données de l'utilisateur (nom, prenom, email, password, role)
 * @returns {Object} 201 - Utilisateur créé avec succès
 * @returns {Error} 403 - Accès refusé
 * @returns {Error} 500 - Erreur serveur
 */
router.post(
  "/utilisateurs",
  verifierToken,
  autoriserRoles("Proviseur"),
  createAdminValidator,
  validerRequete,
  adminController.createAdminUser,
);

module.exports = router;

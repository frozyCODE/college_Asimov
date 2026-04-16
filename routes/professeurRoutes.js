const express = require("express");
const router = express.Router();
const professeurController = require("../controllers/ProfesseurController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");
const { validerRequete } = require("../middlewares/validationMiddleware");
const {
  createProfesseurValidator,
  updateProfesseurValidator,
} = require("../validators/professeurValidator");

/**
 * @module routes/professeurRoutes
 * @description Routes pour la gestion des professeurs.
 * Toutes les routes nécessitent une authentification via token JWT.
 */

router.use(verifierToken);

/**
 * @route GET /api/professeurs
 * @group Professeurs - Opérations sur les professeurs
 * @access Privat - Seuls Secretariat et Proviseur
 * @returns {Array<Object>} 200 - Liste des professeurs
 * @returns {Error} 500 - Erreur serveur
 */
router.get(
  "/",
  autoriserRoles("Secretariat", "Proviseur"),
  professeurController.getProfesseurs,
);

/**
 * @route POST /api/professeurs
 * @group Professeurs - Opérations sur les professeurs
 * @access Privat - Seul Proviseur
 * @param {Object} body.body - Données du professeur (nom, prenom, email, password, matiere, trigramme)
 * @returns {Object} 201 - Professeur créé avec succès
 * @returns {Error} 400 - Données invalides
 * @returns {Error} 500 - Erreur serveur
 */
router.post(
  "/",
  autoriserRoles("Proviseur"),
  createProfesseurValidator,
  validerRequete,
  professeurController.addProfesseur,
);

/**
 * @route PUT /api/professeurs/:id
 * @group Professeurs - Opérations sur les professeurs
 * @access Privat - Seul Proviseur
 * @param {string} id.path.required - ID de l'élève
 * @param {Object} body.body - Nouvelles données du professeur
 * @returns {Object} 200 - Professeur mis à jour avec succès
 * @returns {Error} 404 - Professeur introuvable
 * @returns {Error} 500 - Erreur serveur
 */
router.put(
  "/:id",
  autoriserRoles("Proviseur"),
  updateProfesseurValidator,
  validerRequete,
  professeurController.updateProfesseur,
);

/**
 * @route DELETE /api/professeurs/:id
 * @group Professeurs - Opérations sur les professeurs
 * @access Privat - Seul Proviseur
 * @param {string} id.path.required - ID du professeur
 * @returns {Object} 200 - Professeur supprimé avec succès
 * @returns {Error} 404 - Professeur introuvable
 * @returns {Error} 500 - Erreur serveur
 */
router.delete(
  "/:id",
  autoriserRoles("Proviseur"),
  professeurController.deleteProfesseur,
);

module.exports = router;

const express = require("express");
const router = express.Router();
const parentController = require("../controllers/ParentController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");
const { validerRequete } = require("../middlewares/validationMiddleware");
const {
  createParentValidator,
  lierParentValidator,
} = require("../validators/parentValidator");

/**
 * @module routes/parentRoutes
 * @description Routes pour la gestion des parents d'élèves.
 */

router.use(verifierToken);

/**
 * @route GET /api/parents
 * @group Parents - Gestion des parents
 * @access Privat - Secretariat, Proviseur
 * @returns {Array<Object>} 200 - Liste de tous les parents
 * @returns {Error} 500 - Erreur serveur
 */
router.get(
  "/",
  autoriserRoles("Secretariat", "Proviseur"),
  parentController.getParents,
);

/**
 * @route POST /api/parents
 * @group Parents - Gestion des parents
 * @access Privat - Secretariat, Proviseur
 * @param {Object} body.body - Données du parent (nom, prenom, email, password)
 * @returns {Object} 201 - Parent créé avec succès
 * @returns {Error} 500 - Erreur serveur
 */
router.post(
  "/",
  autoriserRoles("Secretariat", "Proviseur"),
  createParentValidator,
  validerRequete,
  parentController.addParent,
);

/**
 * @route POST /api/parents/lier
 * @group Parents - Gestion des parents
 * @access Privat - Secretariat, Proviseur
 * @param {Object} body.body - Données de la liaison (eleve_id, parent_id)
 * @returns {Object} 201 - Liaison parent-élève établie
 * @returns {Error} 500 - Erreur serveur
 */
router.post(
  "/lier",
  autoriserRoles("Secretariat", "Proviseur"),
  lierParentValidator,
  validerRequete,
  parentController.lierEleve,
);

/**
 * @route GET /api/parents/:parent_id/eleves
 * @group Parents - Gestion des parents
 * @access Privat - Parent, Secretariat, Proviseur
 * @param {string} parent_id.path.required - ID du parent
 * @returns {Array<Object>} 200 - Liste des enfants du parent
 * @returns {Error} 500 - Erreur serveur
 */
router.get(
  "/:parent_id/eleves",
  autoriserRoles("Parent", "Secretariat", "Proviseur"),
  parentController.getMesEleves,
);

module.exports = router;

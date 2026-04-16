const express = require("express");
const router = express.Router();
const stageController = require("../controllers/StageController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");
const { validerRequete } = require("../middlewares/validationMiddleware");
const { createRechercheValidator } = require("../validators/stageValidator");

/**
 * @module routes/stageRoutes
 * @description Routes pour la gestion des recherches de stage par les élèves.
 */

router.use(verifierToken);

/**
 * @route POST /api/stages/recherches
 * @group Stages - Gestion des stages
 * @access Privat - Eleve, Proviseur
 * @param {Object} body.body - Données de la recherche (statut, entreprise, etc.)
 * @returns {Object} 201 - Recherche de stage ajoutée
 * @returns {Error} 500 - Erreur serveur
 */
router.post(
  "/recherches",
  autoriserRoles("Eleve", "Proviseur"),
  createRechercheValidator,
  validerRequete,
  stageController.addRecherche,
);

/**
 * @route GET /api/stages/alertes
 * @group Stages - Gestion des stages
 * @access Privat - Professeur, Secretariat, Proviseur
 * @returns {Array<Object>} 200 - Liste des élèves n'ayant pas trouvé de stage
 * @returns {Error} 500 - Erreur serveur
 */
router.get(
  "/alertes",
  autoriserRoles("Professeur", "Secretariat", "Proviseur"),
  stageController.getAlertes,
);

module.exports = router;

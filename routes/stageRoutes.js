const express = require("express");
const router = express.Router();
const stageController = require("../controllers/StageController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");

/**
 * @module routes/stageRoutes
 * @description Routes pour la gestion des stages et des alertes administratives.
 */

// --- Toutes les routes ci-dessous nécessitent d'être connecté ---
router.use(verifierToken);

/**
 * @route POST /api/stages/recherches
 * @desc Permet à un élève (ou admin) de déclarer une nouvelle recherche.
 * @access Privé - Eleve, Proviseur
 */
router.post(
  "/recherches",
  autoriserRoles("Eleve", "Proviseur"),
  stageController.addRecherche,
);

/**
 * @route GET /api/stages/alertes-quota
 * @desc Récupère la liste des élèves de 3ème en retard sur leurs stages.
 * @access Privé - Proviseur, Secretariat
 */
router.get(
  "/alertes-quota",
  autoriserRoles("Proviseur", "Secretariat"),
  stageController.getAlertesQuota3eme,
);

module.exports = router;

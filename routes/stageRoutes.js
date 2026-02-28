const express = require("express");
const router = express.Router();
const stageController = require("../controllers/StageController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");

// Toutes les routes pour les stages sont protégées
router.use(verifierToken);

// Les élèves ajoutent leurs recherches, les profs/secrétariat voient les alertes
router.post(
  "/recherches",
  autoriserRoles("Eleve", "Proviseur"),
  stageController.addRecherche,
);
router.get(
  "/alertes",
  autoriserRoles("Professeur", "Secretariat", "Proviseur"),
  stageController.getAlertes,
);

module.exports = router;

const express = require("express");
const router = express.Router();
const moyenneController = require("../controllers/MoyenneController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");

// Toutes les routes sont protégées
router.use(verifierToken);

// Création : Professeur ou Proviseur
router.post(
  "/",
  autoriserRoles("Professeur", "Proviseur"),
  moyenneController.createMoyenne,
);

// Consultation : Élève (pour les siennes), Professeur, Secrétariat, Proviseur
router.get(
  "/inscription/:inscription_id",
  autoriserRoles("Eleve", "Professeur", "Secretariat", "Proviseur"),
  moyenneController.getMoyennesByInscription,
);

// Validation : EXCLUSIVEMENT le Proviseur
router.patch(
  "/:id/valider",
  autoriserRoles("Proviseur"),
  moyenneController.validerMoyenne,
);

module.exports = router;

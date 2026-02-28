const express = require("express");
const router = express.Router();
const inscriptionController = require("../controllers/InscriptionController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");

router.use(verifierToken);

// Gestion des inscriptions réservée au secrétariat et au proviseur
router.post(
  "/",
  autoriserRoles("Secretariat", "Proviseur"),
  inscriptionController.createInscription,
);
router.get(
  "/eleve/:eleve_id",
  autoriserRoles("Professeur", "Secretariat", "Proviseur"),
  inscriptionController.getInscriptionsByEleve,
);
router.get(
  "/classe",
  autoriserRoles("Professeur", "Secretariat", "Proviseur"),
  inscriptionController.getInscriptionsByClasse,
);
router.delete(
  "/:id",
  autoriserRoles("Secretariat", "Proviseur"),
  inscriptionController.deleteInscription,
);

module.exports = router;

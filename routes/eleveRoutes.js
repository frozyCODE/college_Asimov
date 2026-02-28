const express = require("express");
const router = express.Router();
const eleveController = require("../controllers/EleveController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");

// Toutes les routes pour les élèves sont protégées
router.use(verifierToken);

// Consultation : Accessible aux Professeurs, Secrétariat et Proviseur
router.get(
  "/",
  autoriserRoles("Professeur", "Secretariat", "Proviseur"),
  eleveController.getEleves,
);

// Création, Modification, Suppression : Réservé au Secrétariat et Proviseur
router.post(
  "/",
  autoriserRoles("Secretariat", "Proviseur"),
  eleveController.addEleve,
);
router.put(
  "/:id",
  autoriserRoles("Secretariat", "Proviseur"),
  eleveController.updateEleve,
);
router.delete(
  "/:id",
  autoriserRoles("Secretariat", "Proviseur"),
  eleveController.deleteEleve,
);

module.exports = router;

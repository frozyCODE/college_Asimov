const express = require("express");
const router = express.Router();
const professeurController = require("../controllers/ProfesseurController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");

// Toutes les routes pour les professeurs sont protégées
router.use(verifierToken);

// Liste des professeurs : Seul le Secrétariat et le Proviseur peuvent voir
router.get(
  "/",
  autoriserRoles("Secretariat", "Proviseur"),
  professeurController.getProfesseurs,
);

// Gestion des professeurs : Réservé EXCLUSIVEMENT au Proviseur
router.post(
  "/",
  autoriserRoles("Proviseur"),
  professeurController.addProfesseur,
);
router.put(
  "/:id",
  autoriserRoles("Proviseur"),
  professeurController.updateProfesseur,
);
router.delete(
  "/:id",
  autoriserRoles("Proviseur"),
  professeurController.deleteProfesseur,
);

module.exports = router;

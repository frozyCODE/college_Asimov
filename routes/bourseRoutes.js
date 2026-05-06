const express = require("express");
const router = express.Router();
const BourseController = require("../controllers/BourseController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");

router.post(
  "/demande",
  verifierToken,
  autoriserRoles("Eleve"),
  BourseController.demanderBourse,
);
router.get(
  "/ma-demande",
  verifierToken,
  autoriserRoles("Eleve"),
  BourseController.getMaDemande,
);

router.get(
  "/",
  verifierToken,
  autoriserRoles("Proviseur", "Secretariat"),
  BourseController.listerDemandes,
);
router.put(
  "/:id/traiter",
  verifierToken,
  autoriserRoles("Proviseur", "Secretariat"),
  BourseController.traiterDemande,
);

module.exports = router;

const express = require("express");
const router = express.Router();
const parentController = require("../controllers/ParentController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");

router.use(verifierToken);

// Seul le secrétariat et le proviseur gèrent les comptes parents
router.get(
  "/",
  autoriserRoles("Secretariat", "Proviseur"),
  parentController.getParents,
);
router.post(
  "/",
  autoriserRoles("Secretariat", "Proviseur"),
  parentController.addParent,
);
router.post(
  "/lier",
  autoriserRoles("Secretariat", "Proviseur"),
  parentController.lierEleve,
);

// Un parent peut voir ses propres enfants
router.get(
  "/:parent_id/eleves",
  autoriserRoles("Parent", "Secretariat", "Proviseur"),
  parentController.getMesEleves,
);

module.exports = router;

const express = require("express");
const router = express.Router();
const optionController = require("../controllers/OptionController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");

router.use(verifierToken);

router.get("/", optionController.getOptions);
router.post(
  "/",
  autoriserRoles("Secretariat", "Proviseur"),
  optionController.addOption,
);
router.post(
  "/choisir",
  autoriserRoles("Eleve", "Secretariat", "Proviseur"),
  optionController.choisirOption,
);
router.delete(
  "/retirer",
  autoriserRoles("Eleve", "Secretariat", "Proviseur"),
  optionController.desisterOption,
);

router.get(
  "/eleve/:eleve_id",
  autoriserRoles("Eleve", "Parent", "Professeur", "Secretariat", "Proviseur"),
  optionController.getOptionsByEleve,
);

router.get(
  "/:option_id/eleves",
  autoriserRoles("Professeur", "Secretariat", "Proviseur"),
  optionController.getElevesByOption,
);

router.delete(
  "/:id",
  autoriserRoles("Secretariat", "Proviseur"),
  optionController.deleteOption,
);

module.exports = router;

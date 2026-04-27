const express = require("express");
const router = express.Router();
const classeController = require("../controllers/ClasseController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");

router.use(verifierToken);
router.get("/", classeController.getClasses);
router.post(
  "/",
  autoriserRoles("Proviseur", "Secretariat"),
  classeController.createClasse,
);
router.delete(
  "/:id",
  autoriserRoles("Proviseur"),
  classeController.deleteClasse,
);

module.exports = router;

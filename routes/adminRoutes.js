const express = require("express");
const router = express.Router();
const adminController = require("../controllers/AdminController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");

// Seul le Proviseur a le droit de créer des comptes administratifs
router.post(
  "/utilisateurs",
  verifierToken,
  autoriserRoles("Proviseur"),
  adminController.createAdminUser,
);

module.exports = router;

/**
 * @module routes/moyenneRoutes
 * @description Routes pour la gestion des résultats scolaires (Moyennes).
 */
const express = require("express");
const router = express.Router();
const moyenneController = require("../controllers/MoyenneController");
const { createMoyenneValidator } = require("../validators/moyenneValidator");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");
const { validerRequete } = require("../middlewares/validationMiddleware");

router.use(verifierToken);

/**
 * @route GET /api/moyennes/inscription/:inscription_id
 * @desc Récupérer les notes d'un élève pour une année donnée
 * @access Professeur, Proviseur, Eleve
 */
router.get(
  "/inscription/:inscription_id",
  autoriserRoles("Professeur", "Proviseur", "Eleve"),
  moyenneController.getMoyennesByInscription,
);

/**
 * @route POST /api/moyennes
 * @desc Saisir une nouvelle moyenne (Semestre 1 ou 2)
 * @access Professeur, Proviseur
 */
router.post(
  "/",
  autoriserRoles("Professeur", "Proviseur"),
  createMoyenneValidator,
  validerRequete,
  moyenneController.createMoyenne,
);

/**
 * @route PATCH /api/moyennes/:id/valider
 * @desc Validation officielle des notes pour le bulletin (Irréversible)
 * @access Proviseur uniquement
 */
router.patch(
  "/:id/valider",
  autoriserRoles("Proviseur"),
  moyenneController.validerMoyenne,
);

module.exports = router;

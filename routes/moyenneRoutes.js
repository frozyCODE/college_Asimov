const express = require("express");
const router = express.Router();
const moyenneController = require("../controllers/MoyenneController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");
const { validerRequete } = require("../middlewares/validationMiddleware");
const { createMoyenneValidator } = require("../validators/moyenneValidator");

/**
 * @module routes/moyenneRoutes
 * @description Routes pour la gestion des moyennes et notes.
 */

router.use(verifierToken);

/**
 * @route POST /api/moyennes
 * @group Moyennes - Gestion des notes
 * @access Privat - Professeur, Proviseur
 * @param {Object} body.body - Données de la moyenne (inscription_id, matiere, note, trimestre)
 * @returns {Object} 201 - Moyenne créée avec succès
 * @returns {Error} 500 - Erreur serveur
 */
router.post(
  "/",
  autoriserRoles("Professeur", "Proviseur"),
  createMoyenneValidator,
  validerRequete,
  moyenneController.createMoyenne,
);

/**
 * @route GET /api/moyennes/inscription/:inscription_id
 * @group Moyennes - Gestion des notes
 * @access Privat - Eleve, Professeur, Secretariat, Proviseur
 * @param {string} inscription_id.path.required - ID de l'inscription
 * @returns {Array<Object>} 200 - Liste des moyennes
 * @returns {Error} 500 - Erreur serveur
 */
router.get(
  "/inscription/:inscription_id",
  autoriserRoles("Eleve", "Professeur", "Secretariat", "Proviseur"),
  moyenneController.getMoyennesByInscription,
);

/**
 * @route PATCH /api/moyennes/:id/valider
 * @group Moyennes - Gestion des notes
 * @access Privat - Seul Proviseur
 * @param {string} id.path.required - ID de la moyenne
 * @returns {Object} 200 - Moyenne validée avec succès
 * @returns {Error} 500 - Erreur serveur
 */
router.patch(
  "/:id/valider",
  autoriserRoles("Proviseur"),
  moyenneController.validerMoyenne,
);

module.exports = router;

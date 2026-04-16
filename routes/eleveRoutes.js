const express = require("express");
const router = express.Router();
const eleveController = require("../controllers/EleveController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");
const { validerRequete } = require("../middlewares/validationMiddleware");
const {
  createEleveValidator,
  updateEleveValidator,
} = require("../validators/eleveValidator");

/**
 * @module routes/eleveRoutes
 * @description Routes pour la gestion des élèves.
 * Nécessite une authentification via token JWT.
 */

router.use(verifierToken);

/**
 * @route GET /api/eleves
 * @group Élèves - Opérations sur les élèves
 * @access Privat - Professeur, Secretariat, Proviseur
 * @returns {Array<Object>} 200 - Liste des élèves avec leurs options et parents
 * @returns {Error} 500 - Erreur serveur
 */
router.get(
  "/",
  autoriserRoles("Professeur", "Secretariat", "Proviseur"),
  eleveController.getEleves,
);

/**
 * @route POST /api/eleves
 * @group Élèves - Opérations sur les élèves
 * @access Privat - Secretariat, Proviseur
 * @param {Object} body.body - Données de l'élève (nom, prenom, email, password, identifiant_csv)
 * @returns {Object} 201 - Élève créé avec succès
 * @returns {Error} 400 - Données invalides
 * @returns {Error} 500 - Erreur serveur
 */
router.post(
  "/",
  autoriserRoles("Secretariat", "Proviseur"),
  createEleveValidator,
  validerRequete,
  eleveController.addEleve,
);

/**
 * @route PUT /api/eleves/:id
 * @group Élèves - Opérations sur les élèves
 * @access Privat - Secretariat, Proviseur
 * @param {string} id.path.required - ID de l'élève
 * @param {Object} body.body - Nouvelles données de l'élève
 * @returns {Object} 200 - Élève mis à jour avec succès
 * @returns {Error} 404 - Élève introuvable
 * @returns {Error} 500 - Erreur serveur
 */
router.put(
  "/:id",
  autoriserRoles("Secretariat", "Proviseur"),
  updateEleveValidator,
  validerRequete,
  eleveController.updateEleve,
);

/**
 * @route DELETE /api/eleves/:id
 * @group Élèves - Opérations sur les élèves
 * @access Privat - Secretariat, Proviseur
 * @param {string} id.path.required - ID de l'élève
 * @returns {Object} 200 - Élève supprimé avec succès
 * @returns {Error} 404 - Élève introuvable
 * @returns {Error} 500 - Erreur serveur
 */
router.delete(
  "/:id",
  autoriserRoles("Secretariat", "Proviseur"),
  eleveController.deleteEleve,
);

module.exports = router;

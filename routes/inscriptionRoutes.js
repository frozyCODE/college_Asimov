const express = require("express");
const router = express.Router();
const inscriptionController = require("../controllers/InscriptionController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");

/**
 * @module routes/inscriptionRoutes
 * @description Routes pour la gestion des inscriptions des élèves aux classes.
 */

router.use(verifierToken);

/**
 * @route POST /api/inscriptions
 * @group Inscriptions - Gestion des inscriptions
 * @access Privat - Secretariat, Proviseur
 * @param {Object} body.body - Données de l'inscription (eleve_id, classe, annee_scolaire)
 * @returns {Object} 201 - Inscription créée avec succès
 * @returns {Error} 500 - Erreur serveur
 */
router.post(
  "/",
  autoriserRoles("Secretariat", "Proviseur"),
  inscriptionController.createInscription,
);

/**
 * @route GET /api/inscriptions/eleve/:eleve_id
 * @group Inscriptions - Gestion des inscriptions
 * @access Privat - Professeur, Secretariat, Proviseur
 * @param {string} eleve_id.path.required - ID de l'élève
 * @returns {Array<Object>} 200 - Liste des inscriptions de l'élève
 * @returns {Error} 500 - Erreur serveur
 */
router.get(
  "/eleve/:eleve_id",
  autoriserRoles("Professeur", "Secretariat", "Proviseur"),
  inscriptionController.getInscriptionsByEleve,
);

/**
 * @route GET /api/inscriptions/classe
 * @group Inscriptions - Gestion des inscriptions
 * @access Privat - Professeur, Secretariat, Proviseur
 * @param {string} classe.query.required - Nom de la classe
 * @returns {Array<Object>} 200 - Liste des élèves de la classe
 * @returns {Error} 500 - Erreur serveur
 */
router.get(
  "/classe",
  autoriserRoles("Professeur", "Secretariat", "Proviseur"),
  inscriptionController.getInscriptionsByClasse,
);

/**
 * @route DELETE /api/inscriptions/:id
 * @group Inscriptions - Gestion des inscriptions
 * @access Privat - Secretariat, Proviseur
 * @param {string} id.path.required - ID de l'inscription
 * @returns {Object} 200 - Inscription supprimée avec succès
 * @returns {Error} 500 - Erreur serveur
 */
router.delete(
  "/:id",
  autoriserRoles("Secretariat", "Proviseur"),
  inscriptionController.deleteInscription,
);

module.exports = router;

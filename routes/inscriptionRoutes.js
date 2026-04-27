const express = require("express");
const router = express.Router();
const inscriptionController = require("../controllers/InscriptionController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");

/**
 * @module routes/inscriptionRoutes
 * @description Routes pour la gestion des inscriptions (Lien Élève <-> Classe).
 */

router.use(verifierToken);

/**
 * @route POST /api/inscriptions
 * @group Inscriptions - Gestion des affectations
 * @access Privat - Secretariat, Proviseur
 * @param {Object} body.body - L'identifiant de l'élève et de la classe (eleve_id, classe_id)
 * @returns {Object} 201 - Inscription enregistrée en base
 * @returns {Error} 500 - Erreur serveur ou 400 si validation échouée
 */
router.post(
  "/",
  autoriserRoles("Secretariat", "Proviseur"),
  inscriptionController.createInscription,
);

/**
 * @route GET /api/inscriptions/eleve/:eleve_id
 * @group Inscriptions - Historique
 * @access Privat - Professeur, Secretariat, Proviseur
 * @param {string} eleve_id.path.required - L'ID interne de l'élève
 * @returns {Array<Object>} 200 - Historique des classes formaté avec les années scolaires
 * @returns {Error} 500 - Erreur serveur
 */
router.get(
  "/eleve/:eleve_id",
  autoriserRoles("Professeur", "Secretariat", "Proviseur", "Eleve", "Parent"),
  inscriptionController.getInscriptionsByEleve,
);

/**
 * @route GET /api/inscriptions/classe/:classe_id
 * @group Inscriptions - Trombinoscope
 * @access Privat - Professeur, Secretariat, Proviseur
 * @param {string} classe_id.path.required - L'ID physique de la classe
 * @returns {Array<Object>} 200 - Liste des élèves affectés à cette classe
 * @returns {Error} 500 - Erreur serveur ou 400 si ID manquant
 */
router.get(
  "/classe/:classe_id",
  autoriserRoles("Professeur", "Secretariat", "Proviseur"),
  inscriptionController.getInscriptionsByClasse,
);

/**
 * @route DELETE /api/inscriptions/:id
 * @group Inscriptions - Gestion des affectations
 * @access Privat - Secretariat, Proviseur
 * @param {string} id.path.required - L'ID unique de l'inscription à annuler
 * @returns {Object} 200 - Confirmation de suppression
 * @returns {Error} 404 - Introuvable
 */
router.delete(
  "/:id",
  autoriserRoles("Secretariat", "Proviseur"),
  inscriptionController.deleteInscription,
);

module.exports = router;

const express = require("express");
const router = express.Router();
const optionController = require("../controllers/OptionController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");
const { validerRequete } = require("../middlewares/validationMiddleware");
const {
  createOptionValidator,
  assignOptionValidator,
} = require("../validators/optionValidator");

/**
 * @module routes/optionRoutes
 * @description Routes pour la gestion des options (matières optionnelles).
 */

router.use(verifierToken);

/**
 * @route GET /api/options
 * @group Options - Gestion des options
 * @access Privat - Authentifié
 * @returns {Array<Object>} 200 - Liste de toutes les options
 * @returns {Error} 500 - Erreur serveur
 */
router.get("/", optionController.getOptions);

/**
 * @route POST /api/options
 * @group Options - Gestion des options
 * @access Privat - Secretariat, Proviseur
 * @param {Object} body.body - Données de l'option (nom, description)
 * @returns {Object} 201 - Option créée avec succès
 * @returns {Error} 500 - Erreur serveur
 */
router.post(
  "/",
  autoriserRoles("Secretariat", "Proviseur"),
  createOptionValidator,
  validerRequete,
  optionController.addOption,
);

/**
 * @route POST /api/options/choisir
 * @group Options - Gestion des options
 * @access Privat - Eleve, Secretariat, Proviseur
 * @param {Object} body.body - Données du choix (eleve_id, option_id)
 * @returns {Object} 201 - Option choisie avec succès
 * @returns {Error} 500 - Erreur serveur
 */
router.post(
  "/choisir",
  autoriserRoles("Eleve", "Secretariat", "Proviseur"),
  assignOptionValidator,
  validerRequete,
  optionController.choisirOption,
);

/**
 * @route DELETE /api/options/retirer
 * @group Options - Gestion des options
 * @access Privat - Eleve, Secretariat, Proviseur
 * @param {Object} body.body - Données du retrait (eleve_id, option_id)
 * @returns {Object} 200 - Option retirée avec succès
 * @returns {Error} 500 - Erreur serveur
 */
router.delete(
  "/retirer",
  autoriserRoles("Eleve", "Secretariat", "Proviseur"),
  optionController.desisterOption,
);

/**
 * @route GET /api/options/eleve/:eleve_id
 * @group Options - Gestion des options
 * @access Privat - Eleve, Parent, Professeur, Secretariat, Proviseur
 * @param {string} eleve_id.path.required - ID de l'élève
 * @returns {Array<Object>} 200 - Liste des options de l'élève
 * @returns {Error} 500 - Erreur serveur
 */
router.get(
  "/eleve/:eleve_id",
  autoriserRoles("Eleve", "Parent", "Professeur", "Secretariat", "Proviseur"),
  optionController.getOptionsByEleve,
);

/**
 * @route GET /api/options/:option_id/eleves
 * @group Options - Gestion des options
 * @access Privat - Professeur, Secretariat, Proviseur
 * @param {string} option_id.path.required - ID de l'option
 * @returns {Array<Object>} 200 - Liste des élèves inscrits à cette option
 * @returns {Error} 500 - Erreur serveur
 */
router.get(
  "/:option_id/eleves",
  autoriserRoles("Professeur", "Secretariat", "Proviseur"),
  optionController.getElevesByOption,
);

/**
 * @route DELETE /api/options/:id
 * @group Options - Gestion des options
 * @access Privat - Secretariat, Proviseur
 * @param {string} id.path.required - ID de l'option à supprimer
 * @returns {Object} 200 - Option supprimée définitivement
 * @returns {Error} 500 - Erreur serveur
 */
router.delete(
  "/:id",
  autoriserRoles("Secretariat", "Proviseur"),
  optionController.deleteOption,
);

module.exports = router;

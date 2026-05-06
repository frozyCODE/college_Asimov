const express = require("express");
const router = express.Router();
const parentController = require("../controllers/ParentController");
const {
  verifierToken,
  autoriserRoles,
} = require("../middlewares/authMiddleware");
const { validerRequete } = require("../middlewares/validationMiddleware");
const {
  createParentValidator,
  lierParentValidator,
} = require("../validators/parentValidator");

/**
 * @module routes/parentRoutes
 * @description Routes pour la gestion des parents d'élèves.
 */

router.use(verifierToken);

/**
 * @route GET /api/parents
 * @desc Récupérer la liste de tous les parents
 * @access Privat - Secretariat, Proviseur
 * @returns {Array<Object>} 200 - Liste de tous les parents
 * @returns {Error} 500 - Erreur serveur
 */
router.get(
  "/",
  autoriserRoles("Secretariat", "Proviseur"),
  parentController.getParents,
);

/**
 * @route POST /api/parents
 * @desc Créer un nouveau parent
 * @access Privat - Secretariat, Proviseur
 * @param {Object} body.body - Données du parent (nom, prenom, email, password)
 * @returns {Object} 201 - Parent créé avec succès
 * @returns {Error} 500 - Erreur serveur
 */
router.post(
  "/",
  autoriserRoles("Secretariat", "Proviseur"),
  createParentValidator,
  validerRequete,
  parentController.addParent,
);

/**
 * @route POST /api/parents/lier
 * @desc Lier un parent à un élève
 * @access Privat - Secretariat, Proviseur
 * @param {Object} body.body - Données de la liaison (eleve_id, parent_id)
 * @returns {Object} 201 - Liaison parent-élève établie
 * @returns {Error} 500 - Erreur serveur
 */
router.post(
  "/lier",
  autoriserRoles("Secretariat", "Proviseur"),
  lierParentValidator,
  validerRequete,
  parentController.lierEleve,
);

/**
 * @route GET /api/parents/:parent_id/eleves
 * @desc Récupérer la liste des enfants d'un parent
 * @access Privat - Parent, Secretariat, Proviseur
 * @param {string} parent_id.path.required - ID du parent
 * @returns {Array<Object>} 200 - Liste des enfants du parent
 * @returns {Error} 500 - Erreur serveur
 */
router.get(
  "/:parent_id/eleves",
  autoriserRoles("Parent", "Secretariat", "Proviseur"),
  parentController.getMesEleves,
);

/**
 * @route GET /api/parents/profile
 * @desc Récupérer le profil du parent connecté
 * @access Privat - Parent
 * @returns {Object} 200 - Profil du parent
 * @returns {Error} 500 - Erreur serveur
 */
router.get("/profile", autoriserRoles("Parent"), parentController.getMonProfil);

/**
 * @route DELETE /api/parents/:id
 * @desc Supprimer un parent
 * @access Privat - Proviseur
 * @param {string} id.path.required - ID du parent à supprimer
 * @returns {Object} 200 - Confirmation de suppression
 * @returns {Error} 500 - Erreur serveur
 */
router.delete(
  "/:id",
  autoriserRoles("Proviseur"),
  parentController.deleteParent,
);

module.exports = router;

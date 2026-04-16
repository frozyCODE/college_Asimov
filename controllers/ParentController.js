const Parent = require("../models/ParentModel");
const response = require("../utils/responseHelper");
const AppError = require("../utils/appError");

/**
 * @module controllers/ParentController
 * @description Contrôleur gérant les opérations sur les profils Parents.
 */

/**
 * Récupérer la liste complète des parents avec leurs comptes utilisateurs.
 *
 * @async
 * @function getParents
 * @param {import('express').Request} req - L'objet de requête Express.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 avec le catalogue des parents.
 */
const getParents = async (req, res, next) => {
  try {
    const liste = await Parent.getAll();
    return response.success(res, 200, "Liste des parents récupérée.", liste);
  } catch (error) {
    next(error);
  }
};

/**
 * Créer un nouveau compte Parent (utilisateur + profil parent).
 *
 * @async
 * @function addParent
 * @param {import('express').Request} req - Données du parent dans `req.body`.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 201 avec le nouvel ID.
 */
const addParent = async (req, res, next) => {
  try {
    const id = await Parent.create(req.body);
    return response.success(res, 201, "Parent créé avec succès !", { id });
  } catch (error) {
    next(error);
  }
};

/**
 * Associer un parent à un élève spécifique (Table de liaison).
 *
 * @async
 * @function lierEleve
 * @param {import('express').Request} req - Contient `eleve_id` et `parent_id` dans `req.body`.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 201 si le lien est créé.
 */
const lierEleve = async (req, res, next) => {
  try {
    const { eleve_id, parent_id } = req.body;
    await Parent.linkToEleve(eleve_id, parent_id);
    return response.success(res, 201, "Lien parent-élève créé avec succès !");
  } catch (error) {
    next(error);
  }
};

/**
 * Lister les élèves associés à un parent précis.
 * Très utile pour générer un tableau de bord parental.
 *
 * @async
 * @function getMesEleves
 * @param {import('express').Request} req - L'ID du parent en params (`parent_id`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 avec le tableau d'enfants.
 */
const getMesEleves = async (req, res, next) => {
  try {
    const { parent_id } = req.params;
    const eleves = await Parent.getElevesByParent(parent_id);
    return response.success(res, 200, "Enfants récupérés avec succès.", eleves);
  } catch (error) {
    next(error);
  }
};

module.exports = { getParents, addParent, lierEleve, getMesEleves };

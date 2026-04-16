const Stage = require("../models/StageModel");
const response = require("../utils/responseHelper");
const AppError = require("../utils/appError");

/**
 * @module controllers/StageController
 * @description Contrôleur traitant du processus d'orientation professionnelle et des stages obligatoires.
 */

/**
 * Enregistrer une démarche ou recherche de stage déclarée par un élève.
 *
 * @async
 * @function addRecherche
 * @param {import('express').Request} req - Données de la recherche dans `req.body`.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 201 avec l'ID du dossier créé.
 */
const addRecherche = async (req, res, next) => {
  try {
    const nouvelId = await Stage.addRecherche(req.body);
    return response.success(res, 201, "Recherche de stage ajoutée !", {
      id: nouvelId,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Surveiller les situations d'alerte (ex: stage toujours en attente proche de l'échéance).
 * Fonction destinée aux professeurs principaux ou direction.
 *
 * @async
 * @function getAlertes
 * @param {import('express').Request} req - L'objet de requête Express.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 avec la liste globale des cas alarmants.
 */
const getAlertes = async (req, res, next) => {
  try {
    const alertes = await Stage.getAlertes();
    return response.success(res, 200, "Liste des alertes récupérée.", alertes);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addRecherche,
  getAlertes,
};

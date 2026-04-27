const Stage = require("../models/StageModel");
const response = require("../utils/responseHelper");
const AppError = require("../utils/appError");

/**
 * Enregistre une recherche de stage pour un élève.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
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
 * Récupère les alertes liées aux stages (stages en attente).
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
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


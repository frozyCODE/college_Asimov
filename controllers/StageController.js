const Stage = require("../models/StageModel");
const AppError = require("../utils/appError");

/**
 * Contrôleur gérant la logique métier des stages.
 */

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
    res.status(201).json({
      success: true,
      message: "Recherche de stage ajoutée !",
      data: { id: nouvelId },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupère les alertes de quota de stages pour les élèves de 3ème.
 * Permet au proviseur de filtrer les élèves n'ayant pas atteint le minimum requis.
 *
 * @async
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const getAlertesQuota3eme = async (req, res, next) => {
  try {
    const seuilMin = parseInt(req.query.min) || 2;
    const alertes = await Stage.getAlertesQuota3eme(seuilMin);

    res.status(200).json({
      success: true,
      message: `Liste des élèves de 3ème ayant moins de ${seuilMin} stages.`,
      count: alertes.length,
      data: alertes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addRecherche,
  getAlertesQuota3eme,
};

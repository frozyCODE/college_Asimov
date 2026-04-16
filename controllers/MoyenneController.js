const Moyenne = require("../models/MoyenneModel");
const AppError = require("../utils/appError");

/**
 * @module controllers/MoyenneController
 * @description Contrôleur gérant les opérations sur les moyennes semestrielles.
 */

/**
 * Créer une nouvelle moyenne semestrielle pour une inscription.
 *
 * @async
 * @function createMoyenne
 * @param {import('express').Request} req - Données de la moyenne (`inscription_id`, `semestre`, `moyenne_generale`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 201 avec l'ID du nouvel enregistrement.
 * @throws {AppError} 400 - Si les données sont incomplètes.
 */
const createMoyenne = async (req, res, next) => {
  try {
    const { inscription_id, semestre, moyenne_generale } = req.body;

    if (!inscription_id || !semestre || moyenne_generale === undefined) {
      throw new AppError(
        "L'identifiant d'inscription, le semestre et la moyenne sont obligatoires.",
        400,
      );
    }

    const nouvelId = await Moyenne.create({
      inscription_id,
      semestre,
      moyenne_generale,
    });

    res.status(201).json({
      message: "Moyenne enregistrée avec succès !",
      id: nouvelId,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer les moyennes associées à une inscription spécifique.
 *
 * @async
 * @function getMoyennesByInscription
 * @param {import('express').Request} req - L'ID de l'inscription en params (`inscription_id`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 avec la liste des moyennes.
 */
const getMoyennesByInscription = async (req, res, next) => {
  try {
    const { inscription_id } = req.params;
    const moyennes = await Moyenne.findByInscription(inscription_id);
    res.status(200).json(moyennes);
  } catch (error) {
    next(error);
  }
};

/**
 * Valider officiellement une moyenne par le proviseur.
 *
 * @async
 * @function validerMoyenne
 * @param {import('express').Request} req - L'ID de la moyenne en params (`id`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 en cas de succès.
 * @throws {AppError} 404 - Si la moyenne est introuvable.
 */
const validerMoyenne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const affectedRows = await Moyenne.validerParProviseur(id);

    if (affectedRows === 0) {
      throw new AppError("Moyenne introuvable.", 404);
    }

    res.status(200).json({ message: "Moyenne validée avec succès !" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMoyenne,
  getMoyennesByInscription,
  validerMoyenne,
};

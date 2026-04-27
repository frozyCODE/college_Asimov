const Moyenne = require("../models/MoyenneModel");
const AppError = require("../utils/appError");

/**
 * Créer une nouvelle moyenne semestrielle pour une inscription.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @throws {AppError} 400 - Si les données sont incomplètes ou si une moyenne existe déjà.
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

    const existante = await Moyenne.findByInscriptionAndSemester(
      inscription_id,
      semestre,
    );
    if (existante) {
      throw new AppError(
        `Une moyenne existe déjà pour le semestre ${semestre} dans ce dossier.`,
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
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
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
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @throws {AppError} 404 - Si la moyenne est introuvable.
 */
const validerMoyenne = async (req, res, next) => {
  try {
    const { id } = req.params;
    const affectedRows = await Moyenne.validate(id);

    if (affectedRows === 0) {
      throw new AppError("Moyenne introuvable.", 404);
    }

    res.status(200).json({ message: "Moyenne validée avec succès !" });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer une moyenne semestrielle. (Proviseur uniquement)
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @throws {AppError} 403 - Si l'utilisateur n'est pas Proviseur.
 * @throws {AppError} 404 - Si la moyenne est introuvable.
 */
const deleteMoyenne = async (req, res, next) => {
  try {
    if (req.user.role !== "Proviseur") {
      throw new AppError("Action réservée au Proviseur.", 403);
    }

    const { id } = req.params;
    const affectedRows = await Moyenne.delete(id);

    if (affectedRows === 0) {
      throw new AppError("Moyenne introuvable.", 404);
    }

    res.status(200).json({ message: "Moyenne supprimée avec succès !" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMoyenne,
  getMoyennesByInscription,
  validerMoyenne,
  deleteMoyenne,
};


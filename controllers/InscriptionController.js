const Inscription = require("../models/InscriptionModel");
const AppError = require("../utils/appError");

/**
 * @module controllers/InscriptionController
 * @description Contrôleur gérant les Inscriptions des élèves aux classes.
 */

/**
 * Créer une nouvelle inscription liant un élève à une classe et une année scolaire.
 *
 * @async
 * @function createInscription
 * @param {import('express').Request} req - Les données d'inscription (`eleve_id`, `annee_scolaire`, `niveau`, `lettre_classe`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 201 avec le nouvel ID.
 * @throws {AppError} 400 - Si des champs obligatoires sont manquants.
 */
const createInscription = async (req, res, next) => {
  try {
    const data = req.body;

    if (
      !data.eleve_id ||
      !data.annee_scolaire ||
      !data.niveau ||
      !data.lettre_classe
    ) {
      throw new AppError(
        "Les champs eleve_id, annee_scolaire, niveau et lettre_classe sont obligatoires.",
        400,
      );
    }

    const nouvelId = await Inscription.create(data);
    res
      .status(201)
      .json({ message: "Inscription créée avec succès !", id: nouvelId });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer l'historique complet des inscriptions pour un élève spécifique.
 *
 * @async
 * @function getInscriptionsByEleve
 * @param {import('express').Request} req - L'ID de l'élève en params (`eleve_id`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 avec la liste des inscriptions.
 */
const getInscriptionsByEleve = async (req, res, next) => {
  try {
    const eleve_id = req.params.eleve_id;
    const inscriptions = await Inscription.findByEleve(eleve_id);
    res.status(200).json(inscriptions);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer la liste des élèves d'une classe spécifique pour une année donnée.
 *
 * @async
 * @function getInscriptionsByClasse
 * @param {import('express').Request} req - Les critères de recherche en query (`annee_scolaire`, `niveau`, `lettre_classe`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 avec le tableau des élèves de la classe.
 * @throws {AppError} 400 - Si des critères de recherche sont manquants.
 */
const getInscriptionsByClasse = async (req, res, next) => {
  try {
    const { annee_scolaire, niveau, lettre_classe } = req.query;

    if (!annee_scolaire || !niveau || !lettre_classe) {
      throw new AppError(
        "Veuillez fournir annee_scolaire, niveau et lettre_classe en paramètres (query).",
        400,
      );
    }

    const inscriptions = await Inscription.findByClasse(
      annee_scolaire,
      niveau,
      lettre_classe,
    );
    res.status(200).json(inscriptions);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer une inscription d'un élève.
 *
 * @async
 * @function deleteInscription
 * @param {import('express').Request} req - L'ID de l'inscription en params (`id`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 si succès.
 * @throws {AppError} 404 - Si l'inscription est introuvable.
 */
const deleteInscription = async (req, res, next) => {
  try {
    const id = req.params.id;
    const affectedRows = await Inscription.delete(id);

    if (affectedRows === 0) {
      throw new AppError("Inscription introuvable.", 404);
    }

    res.status(200).json({ message: "Inscription supprimée avec succès !" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInscription,
  getInscriptionsByEleve,
  getInscriptionsByClasse,
  deleteInscription,
};

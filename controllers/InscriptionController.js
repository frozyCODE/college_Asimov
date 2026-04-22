const Inscription = require("../models/InscriptionModel");
const AppError = require("../utils/appError");

/**
 * @module controllers/InscriptionController
 * @description Contrôleur gérant les Inscriptions des élèves aux classes.
 */

/**
 * Créer une nouvelle inscription liant un élève à une classe.
 *
 * @async
 * @function createInscription
 * @param {import('express').Request} req - Les données d'inscription dans le body (`eleve_id`, `classe_id`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant pour la gestion d'erreurs.
 * @returns {Promise<void>} 201 avec un message de succès et l'ID créé.
 * @throws {AppError} 400 - Si les champs obligatoires sont manquants.
 */
const createInscription = async (req, res, next) => {
  try {
    const { eleve_id, classe_id } = req.body;

    if (!eleve_id || !classe_id) {
      throw new AppError(
        "Les champs eleve_id et classe_id sont obligatoires.",
        400,
      );
    }

    const nouvelId = await Inscription.create({ eleve_id, classe_id });
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
 * @param {import('express').Request} req - L'ID de l'élève en params d'URL (`eleve_id`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 avec le tableau d'objets inscriptions formatés.
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
 * Récupérer la liste des élèves inscrits dans une classe spécifique.
 *
 * @async
 * @function getInscriptionsByClasse
 * @param {import('express').Request} req - L'ID de la classe en params d'URL (`classe_id`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 avec le tableau détaillé des élèves.
 * @throws {AppError} 400 - Si le paramètre classe_id est manquant.
 */
const getInscriptionsByClasse = async (req, res, next) => {
  try {
    const { classe_id } = req.params;

    if (!classe_id) {
      throw new AppError(
        "Veuillez fournir l'ID de la classe en paramètre.",
        400,
      );
    }

    const inscriptions = await Inscription.findByClasse(classe_id);
    res.status(200).json(inscriptions);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer une inscription existante.
 *
 * @async
 * @function deleteInscription
 * @param {import('express').Request} req - L'ID de l'inscription à supprimer en params (`id`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 avec confirmation textuelle.
 * @throws {AppError} 404 - Si l'inscription n'existe pas ou a déjà été supprimée.
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

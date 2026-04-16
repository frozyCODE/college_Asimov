const Option = require("../models/OptionModel");
const AppError = require("../utils/appError");

/**
 * @module controllers/OptionController
 * @description Contrôleur gérant les opérations sur les Options.
 */

/**
 * Récupérer la liste complète de toutes les options du catalogue.
 *
 * @async
 * @function getOptions
 * @param {import('express').Request} req - L'objet de requête Express.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 avec la liste des options.
 */
const getOptions = async (req, res, next) => {
  try {
    const options = await Option.getAll();
    res.status(200).json(options);
  } catch (error) {
    next(error);
  }
};

/**
 * Créer une nouvelle option dans le catalogue (ex: Théâtre).
 *
 * @async
 * @function addOption
 * @param {import('express').Request} req - Contient le `nom` de la nouvelle option dans `req.body`.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 201 avec l'ID si succès.
 * @throws {AppError} 400 - Si le nom de l'option est manquant.
 */
const addOption = async (req, res, next) => {
  try {
    const { nom } = req.body;
    if (!nom) {
      throw new AppError("Le nom de l'option est requis.", 400);
    }
    const id = await Option.create(nom);
    res.status(201).json({ message: "Option créée avec succès !", id });
  } catch (error) {
    next(error);
  }
};

/**
 * Assigner une option à un élève. Gère la limite de 2 options par élève.
 *
 * @async
 * @function choisirOption
 * @param {import('express').Request} req - Contient `eleve_id` et `option_id` dans `req.body`.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 201 si succès.
 * @throws {AppError} 400 - Si le quota d'options est dépassé.
 */
const choisirOption = async (req, res, next) => {
  try {
    const { eleve_id, option_id } = req.body;
    await Option.assignToEleve(eleve_id, option_id);
    res.status(201).json({ message: "Option assignée avec succès !" });
  } catch (error) {
    if (error.message.includes("maximum")) {
      return next(new AppError(error.message, 400));
    }
    next(error);
  }
};

/**
 * Résilier le choix d'une option pour un élève spécifique.
 *
 * @async
 * @function desisterOption
 * @param {import('express').Request} req - Contient `eleve_id` et `option_id` dans `req.body`.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 si retirée.
 * @throws {AppError} 404 - Si le lien élève-option est introuvable.
 */
const desisterOption = async (req, res, next) => {
  try {
    const { eleve_id, option_id } = req.body;
    const affectedRows = await Option.removeFromEleve(eleve_id, option_id);
    if (affectedRows === 0) {
      throw new AppError("Lien non trouvé.", 404);
    }
    res.status(200).json({ message: "Option retirée." });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer toutes les options auxquelles un élève est inscrit.
 *
 * @async
 * @function getOptionsByEleve
 * @param {import('express').Request} req - L'ID de l'élève en params (`eleve_id`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 avec la liste de ses options.
 */
const getOptionsByEleve = async (req, res, next) => {
  try {
    const eleve_id = req.params.eleve_id;
    const options = await Option.getByEleve(eleve_id);
    res.status(200).json(options);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupérer tous les élèves inscrits dans une option précise.
 *
 * @async
 * @function getElevesByOption
 * @param {import('express').Request} req - L'ID de l'option en params (`option_id`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 avec la liste des élèves correspondants.
 */
const getElevesByOption = async (req, res, next) => {
  try {
    const option_id = req.params.option_id;
    const eleves = await Option.getElevesByOption(option_id);
    res.status(200).json(eleves);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer définitivement une option du catalogue.
 *
 * @async
 * @function deleteOption
 * @param {import('express').Request} req - L'ID de l'option en params (`id`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 si succès.
 * @throws {AppError} 404 - Si l'option est introuvable.
 */
const deleteOption = async (req, res, next) => {
  try {
    const id = req.params.id;
    const affectedRows = await Option.delete(id);
    if (affectedRows === 0) {
      throw new AppError("Option introuvable.", 404);
    }
    res.status(200).json({ message: "Option supprimée avec succès !" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOptions,
  addOption,
  choisirOption,
  desisterOption,
  getOptionsByEleve,
  getElevesByOption,
  deleteOption,
};

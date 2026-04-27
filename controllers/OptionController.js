const Option = require("../models/OptionModel");
const Eleve = require("../models/EleveModel");
const AppError = require("../utils/appError");

/**
 * Récupère toutes les options du catalogue.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
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
 * Crée une nouvelle option.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
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
 * Assigne une option à un élève (max 2 options).
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
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
 * Retire une option pour un élève spécifique.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @throws {AppError} 404 - Si l'assignation est introuvable.
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
 * Récupère les options d'un élève.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const getOptionsByEleve = async (req, res, next) => {
  try {
    const eleve_id = req.params.eleve_id;

    // Sécurité : Un élève ne peut voir que ses propres options
    if (req.user.role === "Eleve") {
      const profil = await Eleve.findByUtilisateurId(req.user.id);
      if (!profil || profil.id != eleve_id) {
        throw new AppError(
          "Accès interdit. Vous ne pouvez consulter que vos propres options.",
          403,
        );
      }
    }

    const options = await Option.getByEleve(eleve_id);
    res.status(200).json(options);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupère les élèves inscrits à une option.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
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
 * Supprime définitivement une option du catalogue.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
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


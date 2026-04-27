const Professeur = require("../models/ProfesseurModel");
const AppError = require("../utils/appError");

/**
 * Récupère la liste de tous les professeurs actifs.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const getProfesseurs = async (req, res, next) => {
  try {
    const liste = await Professeur.getAll();
    res.status(200).json(liste);
  } catch (error) {
    next(error);
  }
};

/**
 * Ajoute un nouveau professeur et son compte utilisateur.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const addProfesseur = async (req, res, next) => {
  try {
    const data = req.body;
    const nouvelId = await Professeur.create(data);
    res
      .status(201)
      .json({ message: "Professeur créé avec succès !", id: nouvelId });
  } catch (error) {
    next(error);
  }
};

/**
 * Met à jour les informations d'un professeur.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @throws {AppError} 404 - Si le professeur est introuvable.
 */
const updateProfesseur = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const affectedRows = await Professeur.update(id, data);

    if (affectedRows === 0) {
      throw new AppError("Professeur introuvable ou aucune modification apportée.", 404);
    }
    res.status(200).json({ message: "Professeur mis à jour avec succès !" });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprime un professeur par son identifiant.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @throws {AppError} 404 - Si le professeur est introuvable.
 */
const deleteProfesseur = async (req, res, next) => {
  try {
    const id = req.params.id;
    const affectedRows = await Professeur.delete(id);

    if (affectedRows === 0) {
      throw new AppError("Professeur introuvable.", 404);
    }
    res.status(200).json({ message: "Professeur supprimé avec succès !" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfesseurs,
  addProfesseur,
  updateProfesseur,
  deleteProfesseur,
};


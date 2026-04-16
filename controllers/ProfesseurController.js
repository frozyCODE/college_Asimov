const Professeur = require("../models/ProfesseurModel");
const AppError = require("../utils/appError");

/**
 * @module controllers/ProfesseurController
 * @description Contrôleur gérant les opérations CRUD sur les Professeurs.
 */

/**
 * Récupérer et renvoyer la liste complète des professeurs actifs.
 *
 * @async
 * @function getProfesseurs
 * @param {import('express').Request} req - L'objet requête Express.
 * @param {import('express').Response} res - L'objet réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 avec le tableau des professeurs.
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
 * Créer un nouveau profil Professeur (et son compte Utilisateur par transaction).
 *
 * @async
 * @function addProfesseur
 * @param {import('express').Request} req - Contient les données (nom, prenom, email, password, matiere, trigramme).
 * @param {import('express').Response} res - L'objet réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 201 avec l'ID du professeur.
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
 * Mettre à jour les informations d'un professeur spécifique.
 *
 * @async
 * @function updateProfesseur
 * @param {import('express').Request} req - L'ID cible en param (`req.params.id`), données en corps (`req.body`).
 * @param {import('express').Response} res - L'objet réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 en cas de succès.
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
 * Supprimer définitivement un professeur et l'utilisateur associé.
 *
 * @async
 * @function deleteProfesseur
 * @param {import('express').Request} req - L'ID du professeur en param (`req.params.id`).
 * @param {import('express').Response} res - L'objet réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 en cas de succès.
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

const Eleve = require("../models/EleveModel");
const AppError = require("../utils/appError");

/**
 * @module controllers/EleveController
 * @description Contrôleur gérant les opérations CRUD sur les Élèves.
 */

/**
 * Récupérer la liste complète de tous les élèves avec leurs options et parents.
 *
 * @async
 * @function getEleves
 * @param {import('express').Request} req - L'objet de requête Express.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 avec le tableau des élèves.
 */
const getEleves = async (req, res, next) => {
  try {
    const liste = await Eleve.getAll();
    res.status(200).json(liste);
  } catch (error) {
    next(error);
  }
};

/**
 * Créer un nouveau profil Élève (incluant la création de son compte Utilisateur).
 *
 * @async
 * @function addEleve
 * @param {import('express').Request} req - Les données de l'élève (`nom`, `prenom`, `email`, `password`, `identifiant_csv`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 201 avec l'ID du nouvel élève.
 */
const addEleve = async (req, res, next) => {
  try {
    const data = req.body;
    const nouvelId = await Eleve.create(data);
    res.status(201).json({ message: "Élève créé avec succès !", id: nouvelId });
  } catch (error) {
    next(error);
  }
};

/**
 * Modifier les informations personnelles de base d'un élève.
 *
 * @async
 * @function updateEleve
 * @param {import('express').Request} req - Contient l'ID cible en `req.params.id` et les nouvelles données en `req.body`.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 si mis à jour.
 * @throws {AppError} 404 - Si l'élève est introuvable.
 */
const updateEleve = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const affectedRows = await Eleve.update(id, data);

    if (affectedRows === 0) {
      throw new AppError("Élève introuvable ou aucune modification apportée.", 404);
    }

    res.status(200).json({ message: "Élève mis à jour avec succès !" });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer définitivement un élève et désactiver/supprimer son compte utilisateur.
 *
 * @async
 * @function deleteEleve
 * @param {import('express').Request} req - L'ID de l'élève cible en `req.params.id`.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 si succès.
 * @throws {AppError} 404 - Si l'élève n'existe pas.
 */
const deleteEleve = async (req, res, next) => {
  try {
    const id = req.params.id;
    const affectedRows = await Eleve.delete(id);
    if (affectedRows === 0) {
      throw new AppError("Élève introuvable.", 404);
    }
    res.status(200).json({ message: "Élève supprimé avec succès !" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEleves,
  addEleve,
  updateEleve,
  deleteEleve,
};

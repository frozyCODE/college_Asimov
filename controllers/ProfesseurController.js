const Professeur = require("../models/ProfesseurModel");

/**
 * Contrôleur gérant les opérations CRUD sur les Professeurs.
 * @module ProfesseurController
 */

/**
 * Récupérer et renvoyer la liste complète des professeurs actifs.
 *
 * @async
 * @function getProfesseurs
 * @param {import('express').Request} req - L'objet requête Express.
 * @param {import('express').Response} res - L'objet réponse Express.
 * @returns {Promise<void>} 200 avec le tableau des professeurs, ou 500 en cas d'erreur.
 */
const getProfesseurs = async (req, res) => {
  try {
    const liste = await Professeur.getAll();
    res.status(200).json(liste);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération",
        detail: error.message,
      });
  }
};

/**
 * Créer un nouveau profil Professeur (et son compte Utilisateur par transaction).
 *
 * @async
 * @function addProfesseur
 * @param {import('express').Request} req - Contient les données (nom, prenom, email, password, matiere, trigramme).
 * @param {import('express').Response} res - L'objet réponse Express.
 * @returns {Promise<void>} 201 avec l'ID du professeur, 500 en cas d'erreur DB.
 */
const addProfesseur = async (req, res) => {
  try {
    const data = req.body;
    const nouvelId = await Professeur.create(data);
    res
      .status(201)
      .json({ message: "Professeur créé avec succès !", id: nouvelId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création", detail: error.message });
  }
};

/**
 * Mettre à jour les informations d'un professeur spécifique.
 *
 * @async
 * @function updateProfesseur
 * @param {import('express').Request} req - L'ID cible en param (`req.params.id`), données en corps (`req.body`).
 * @param {import('express').Response} res - L'objet réponse Express.
 * @returns {Promise<void>} 200 en cas de succès, 404 si introuvable, 500 en cas d'erreur.
 */
const updateProfesseur = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const affectedRows = await Professeur.update(id, data);

    if (affectedRows === 0) {
      return res
        .status(404)
        .json({
          message: "Professeur introuvable ou aucune modification apportée.",
        });
    }
    res.status(200).json({ message: "Professeur mis à jour avec succès !" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la mise à jour",
        detail: error.message,
      });
  }
};

/**
 * Supprimer définitivement un professeur et l'utilisateur associé.
 *
 * @async
 * @function deleteProfesseur
 * @param {import('express').Request} req - L'ID du professeur en param (`req.params.id`).
 * @param {import('express').Response} res - L'objet réponse Express.
 * @returns {Promise<void>} 200 en cas de succès, 404 si introuvable, 500 en cas d'erreur.
 */
const deleteProfesseur = async (req, res) => {
  try {
    const id = req.params.id;
    const affectedRows = await Professeur.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Professeur introuvable." });
    }
    res.status(200).json({ message: "Professeur supprimé avec succès !" });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la suppression",
        detail: error.message,
      });
  }
};

module.exports = {
  getProfesseurs,
  addProfesseur,
  updateProfesseur,
  deleteProfesseur,
};

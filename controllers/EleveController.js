const Eleve = require("../models/EleveModel");

/**
 * Contrôleur gérant les opérations CRUD sur les Élèves.
 * @module EleveController
 */

/**
 * Récupérer la liste complète de tous les élèves avec leurs options et parents.
 *
 * @async
 * @function getEleves
 * @param {import('express').Request} req - L'objet de requête Express.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @returns {Promise<void>} 200 avec le tableau des élèves, ou 500 en cas d'erreur.
 */
const getEleves = async (req, res) => {
  try {
    const liste = await Eleve.getAll();
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
 * Créer un nouveau profil Élève (incluant la création de son compte Utilisateur).
 *
 * @async
 * @function addEleve
 * @param {import('express').Request} req - Les données de l'élève (`nom`, `prenom`, `email`, `password`, `identifiant_csv`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @returns {Promise<void>} 201 avec l'ID du nouvel élève, ou 500 en cas d'erreur.
 */
const addEleve = async (req, res) => {
  try {
    const data = req.body;
    const nouvelId = await Eleve.create(data);
    res.status(201).json({ message: "Élève créé avec succès !", id: nouvelId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création", detail: error.message });
  }
};

/**
 * Modifier les informations personnelles de base d'un élève.
 *
 * @async
 * @function updateEleve
 * @param {import('express').Request} req - Contient l'ID cible en `req.params.id` et les nouvelles données en `req.body`.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @returns {Promise<void>} 200 si mis à jour, 404 si introuvable, ou 500 en cas d'erreur.
 */
const updateEleve = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;

    const affectedRows = await Eleve.update(id, data);

    // Si 0 ligne a été modifiée, c'est que l'ID n'existe pas dans la base de données
    if (affectedRows === 0) {
      return res
        .status(404)
        .json({
          message: "Élève introuvable ou aucune modification apportée.",
        });
    }

    // Si tout va bien, on renvoie un code 200
    res.status(200).json({ message: "Élève mis à jour avec succès !" });
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
 * Supprimer définitivement un élève et désactiver/supprimer son compte utilisateur.
 *
 * @async
 * @function deleteEleve
 * @param {import('express').Request} req - L'ID de l'élève cible en `req.params.id`.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @returns {Promise<void>} 200 si succès, 404 si l'élève n'existait pas, 500 en cas d'erreur.
 */
const deleteEleve = async (req, res) => {
  try {
    const id = req.params.id;
    const affectedRows = await Eleve.delete(id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Élève introuvable." });
    }
    res.status(200).json({ message: "Élève supprimé avec succès !" });
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
  getEleves,
  addEleve,
  updateEleve,
  deleteEleve,
};

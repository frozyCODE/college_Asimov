const Inscription = require("../models/InscriptionModel");

/**
 * Contrôleur gérant les Inscriptions des élèves aux classes.
 * @module InscriptionController
 */

/**
 * Créer une nouvelle inscription liant un élève à une classe et une année scolaire.
 *
 * @async
 * @function createInscription
 * @param {import('express').Request} req - Les données d'inscription (`eleve_id`, `annee_scolaire`, `niveau`, `lettre_classe`).
 * @param {import('express').Response} res - L'objet de réponse.
 * @returns {Promise<void>} 201 avec le nouvel ID, 400 si incomplet, ou 500.
 */
const createInscription = async (req, res) => {
  try {
    const data = req.body;
    // Validation basique
    if (
      !data.eleve_id ||
      !data.annee_scolaire ||
      !data.niveau ||
      !data.lettre_classe
    ) {
      return res
        .status(400)
        .json({
          message:
            "Les champs eleve_id, annee_scolaire, niveau et lettre_classe sont obligatoires.",
        });
    }

    const nouvelId = await Inscription.create(data);
    res
      .status(201)
      .json({ message: "Inscription créée avec succès !", id: nouvelId });
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la création de l'inscription",
        detail: error.message,
      });
  }
};

/**
 * Récupérer l'historique complet des inscriptions pour un élève spécifique.
 *
 * @async
 * @function getInscriptionsByEleve
 * @param {import('express').Request} req - L'ID de l'élève en params (`eleve_id`).
 * @param {import('express').Response} res - L'objet de réponse.
 * @returns {Promise<void>} 200 avec la liste des inscriptions.
 */
const getInscriptionsByEleve = async (req, res) => {
  try {
    const eleve_id = req.params.eleve_id;
    const inscriptions = await Inscription.findByEleve(eleve_id);
    res.status(200).json(inscriptions);
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
 * Récupérer la liste des élèves d'une classe spécifique pour une année donnée.
 *
 * @async
 * @function getInscriptionsByClasse
 * @param {import('express').Request} req - Les critères de recherche en query (`annee_scolaire`, `niveau`, `lettre_classe`).
 * @param {import('express').Response} res - L'objet de réponse.
 * @returns {Promise<void>} 200 avec le tableau des élèves de la classe.
 */
const getInscriptionsByClasse = async (req, res) => {
  try {
    const { annee_scolaire, niveau, lettre_classe } = req.query;

    if (!annee_scolaire || !niveau || !lettre_classe) {
      return res
        .status(400)
        .json({
          message:
            "Veuillez fournir annee_scolaire, niveau et lettre_classe en paramètres (query).",
        });
    }

    const inscriptions = await Inscription.findByClasse(
      annee_scolaire,
      niveau,
      lettre_classe,
    );
    res.status(200).json(inscriptions);
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
 * Supprimer une inscription d'un élève.
 *
 * @async
 * @function deleteInscription
 * @param {import('express').Request} req - L'ID de l'inscription en params (`id`).
 * @param {import('express').Response} res - L'objet de réponse.
 * @returns {Promise<void>} 200 si succès, ou 404 introuvable.
 */
const deleteInscription = async (req, res) => {
  try {
    const id = req.params.id;
    const affectedRows = await Inscription.delete(id);

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Inscription introuvable." });
    }

    res.status(200).json({ message: "Inscription supprimée avec succès !" });
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
  createInscription,
  getInscriptionsByEleve,
  getInscriptionsByClasse,
  deleteInscription,
};

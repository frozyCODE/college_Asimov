const Moyenne = require("../models/MoyenneModel");

/**
 * Contrôleur traitant l'enregistrement et la validation des moyennes trimestrielles/semestrielles.
 * @module MoyenneController
 */

/**
 * Insérer une nouvelle moyenne pour une inscription spécifique.
 *
 * @async
 * @function createMoyenne
 * @param {import('express').Request} req - Les données de la note globale (`inscription_id`, `semestre`, `moyenne_generale`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @returns {Promise<void>} Renvoie 201 avec l'ID en cas de succès, 400 si infos manquantes ou 500.
 */
const createMoyenne = async (req, res) => {
  try {
    const data = req.body;
    if (!data.inscription_id || !data.semestre || !data.moyenne_generale) {
      return res.status(400).json({
        message:
          "Les champs inscription_id, semestre et moyenne_generale sont obligatoires.",
      });
    }
    const nouvelId = await Moyenne.create(data);
    res
      .status(201)
      .json({ message: "Moyenne ajoutée avec succès !", id: nouvelId });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de l'ajout de la moyenne",
      detail: error.message,
    });
  }
};

/**
 * Récupérer toutes les moyennes (historique) associées à l'inscription d'un élève.
 *
 * @async
 * @function getMoyennesByInscription
 * @param {import('express').Request} req - L'ID de l'inscription cible en params (`inscription_id`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @returns {Promise<void>} 200 avec la liste des notes, 500 en cas de problème serveur.
 */
const getMoyennesByInscription = async (req, res) => {
  try {
    const inscription_id = req.params.inscription_id;
    const moyennes = await Moyenne.findByInscription(inscription_id);
    res.status(200).json(moyennes);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération",
      detail: error.message,
    });
  }
};

/**
 * Figer et sceller une moyenne officielle (Action exclusive assignée au Proviseur).
 *
 * @async
 * @function validerMoyenne
 * @param {import('express').Request} req - L'ID de la moyenne à valider dans `req.params.id`.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @returns {Promise<void>} 200 si la moyenne est scellée, 404 si elle n'existe pas, ou 500 en cas de bug.
 */
const validerMoyenne = async (req, res) => {
  try {
    const id = req.params.id;
    const affectedRows = await Moyenne.validerParProviseur(id);
    if (affectedRows === 0)
      return res.status(404).json({ message: "Moyenne introuvable." });
    res
      .status(200)
      .json({ message: "Moyenne validée par le proviseur avec succès !" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la validation", detail: error.message });
  }
};

module.exports = { createMoyenne, getMoyennesByInscription, validerMoyenne };

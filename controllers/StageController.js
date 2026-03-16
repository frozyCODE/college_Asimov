const Stage = require("../models/StageModel");

/**
 * Contrôleur traitant du processus d'orientation professionnelle et des stages obligatoires.
 * @module StageController
 */

/**
 * Enregistrer une démarche ou recherche de stage déclarée par un élève.
 *
 * @async
 * @function addRecherche
 * @param {import('express').Request} req - Contient `eleve_id`, `nom_entreprise`, `contact` etc.
 * @param {import('express').Response} res - L'objet de réponse.
 * @returns {Promise<void>} 201 avec l'ID du dossier créé, 500 en cas d'erreur.
 */
const addRecherche = async (req, res) => {
  try {
    const nouvelId = await Stage.addRecherche(req.body);
    res
      .status(201)
      .json({ message: "Recherche de stage ajoutée !", id: nouvelId });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout", detail: error.message });
  }
};
/**
 * Surveiller les situations d'alerte (ex: stage toujours en attente proche de l'échéance).
 * Fonction destinée aux professeurs principaux ou direction.
 *
 * @async
 * @function getAlertes
 * @param {import('express').Request} req - L'objet de requête.
 * @param {import('express').Response} res - L'objet de réponse.
 * @returns {Promise<void>} 200 avec la liste globale des cas alarmants, 500 en cas de souci BD.
 */
const getAlertes = async (req, res) => {
  try {
    const alertes = await Stage.getAlertes();
    res.status(200).json(alertes);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des alertes",
        detail: error.message,
      });
  }
};

module.exports = {
  addRecherche,
  getAlertes,
};

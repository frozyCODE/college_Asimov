const Stage = require('../models/StageModel');

/**
 * Contrôleur pour gérer les opérations liées aux stages.
 * @param {Object} req - Objet de requête.
 * @param {Object} res - Objet de réponse.
 * @returns {Promise<void>} - Promesse de la réponse.
 */
const addRecherche = async (req, res) => {
    try {
        const nouvelId = await Stage.addRecherche(req.body);
        res.status(201).json({ message: "Recherche de stage ajoutée !", id: nouvelId });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout", detail: error.message });
    }
};
/**
 * Contrôleur pour récupérer les alertes de stage.
 * @param {Object} req - Objet de requête.
 * @param {Object} res - Objet de réponse.
 * @returns {Promise<void>} - Promesse de la réponse.
 */
const getAlertes = async (req, res) => {
    try {
        const alertes = await Stage.getAlertes();
        res.status(200).json(alertes);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des alertes", detail: error.message });
    }
};

module.exports = {
    addRecherche,
    getAlertes
};
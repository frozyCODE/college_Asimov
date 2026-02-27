const Moyenne = require('../models/MoyenneModel');

/**
 * Ajouter une nouvelle moyenne (contrôleur).
 * Cette fonction extrait les données du corps de la requête (req.body)
 * et fait appel au modèle pour enregistrer la moyenne en base de données.
 * 
 * @param {Object} req - L'objet de requête Express (contenant `body.inscription_id`, `body.semestre`, `body.moyenne_generale`).
 * @param {Object} res - L'objet de réponse Express.
 * @returns {Promise<void>} Renvoie une réponse JSON avec le statut du traitement.
 */
const createMoyenne = async (req, res) => {
    try {
        const data = req.body;
        if (!data.inscription_id || !data.semestre || !data.moyenne_generale) {
            return res.status(400).json({ message: "Les champs inscription_id, semestre et moyenne_generale sont obligatoires." });
        }
        const nouvelId = await Moyenne.create(data);
        res.status(201).json({ message: "Moyenne ajoutée avec succès !", id: nouvelId });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout de la moyenne", detail: error.message });
    }
};

/**
 * Récupère et renvoie la liste de toutes les moyennes.
 * 
 * @param {Object} req - L'objet requête Express.
 * @param {Object} res - L'objet réponse Express.
 * @returns {Promise<void>} Renvoie un objet JSON contenant la liste des moyennes avec un statut 200. Erreur statut 500 en cas de problème.
 */
const getMoyennesByInscription = async (req, res) => {
    try {
        const inscription_id = req.params.inscription_id;
        const moyennes = await Moyenne.findByInscription(inscription_id);
        res.status(200).json(moyennes);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération", detail: error.message });
    }
};

/**
 * Valide une moyenne (action du proviseur).
 * 
 * @param {Object} req - L'objet requête Express, contenant l'ID en param (`req.params.id`).
 * @param {Object} res - L'objet réponse Express.
 * @returns {Promise<void>} Renvoie un message de succès (code 200) ou non trouvé (code 404). Erreur code 500 en cas de problème.
 */
const validerMoyenne = async (req, res) => {
    try {
        const id = req.params.id;
        const affectedRows = await Moyenne.validerParProviseur(id);
        if (affectedRows === 0) return res.status(404).json({ message: "Moyenne introuvable." });
        res.status(200).json({ message: "Moyenne validée par le proviseur avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la validation", detail: error.message });
    }
};

module.exports = { createMoyenne, getMoyennesByInscription, validerMoyenne };

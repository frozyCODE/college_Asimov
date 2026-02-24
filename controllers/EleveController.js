const Eleve = require('../models/EleveModel');

/**
 * Fonction pour lister tous les élèves.
 * 
 * @param {Object} req - L'objet requête Express.
 * @param {Object} res - L'objet réponse Express.
 * @returns {Promise<void>} Renvoie un objet JSON contenant la liste des élèves (code 200). Erreur code 500 en cas de problème.
 */
const getEleves = async (req, res) => {
    try {
        const liste = await Eleve.getAll();
        res.status(200).json(liste);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération", detail: error.message });
    }
};

/**
 * Fonction pour créer un nouvel élève.
 * 
 * @param {Object} req - L'objet requête Express, contenant les données de l'élève (`req.body`).
 * @param {Object} res - L'objet réponse Express.
 * @returns {Promise<void>} Renvoie un message de succès et l'ID du nouvel élève (code 201). Erreur code 500 en cas de problème.
 */
const addEleve = async (req, res) => {
    try {
        const data = req.body;
        const nouvelId = await Eleve.create(data);
        res.status(201).json({ message: "Élève créé avec succès !", id: nouvelId });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création", detail: error.message });
    }
};

/**
 * Fonction pour modifier les informations de base d'un élève (nom, prénom, email).
 * 
 * @param {Object} req - L'objet requête Express, contenant l'ID en paramètre (`req.params.id`) et les modifications (`req.body`).
 * @param {Object} res - L'objet réponse Express.
 * @returns {Promise<void>} Renvoie un message de succès (code 200), ou introuvable (code 404). Erreur code 500 en cas de problème.
 */
const updateEleve = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        const affectedRows = await Eleve.update(id, data);

        // Si 0 ligne a été modifiée, c'est que l'ID n'existe pas dans la base de données
        if (affectedRows === 0) {
            return res.status(404).json({ message: "Élève introuvable ou aucune modification apportée." });
        }

        // Si tout va bien, on renvoie un code 200
        res.status(200).json({ message: "Élève mis à jour avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour", detail: error.message });
    }
};

/**
 * Fonction pour supprimer un élève et l'utilisateur associé.
 * 
 * @param {Object} req - L'objet requête Express, contenant l'ID en paramètre (`req.params.id`).
 * @param {Object} res - L'objet réponse Express.
 * @returns {Promise<void>} Renvoie un message de succès (code 200), ou introuvable (code 404). Erreur code 500 en cas de problème.
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
        res.status(500).json({ message: "Erreur lors de la suppression", detail: error.message });
    }
};

module.exports = {
    getEleves,
    addEleve,
    updateEleve,
    deleteEleve
};
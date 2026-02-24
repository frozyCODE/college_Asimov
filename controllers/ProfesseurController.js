const Professeur = require('../models/ProfesseurModel');

/**
 * Récupère et renvoie la liste de tous les professeurs.
 * 
 * @param {Object} req - L'objet requête Express.
 * @param {Object} res - L'objet réponse Express.
 * @returns {Promise<void>} Renvoie un objet JSON contenant la liste des professeurs avec un statut 200. Erreur statut 500 en cas de problème.
 */
const getProfesseurs = async (req, res) => {
    try {
        const liste = await Professeur.getAll();
        res.status(200).json(liste);
    }
    catch (error){
        res.status(500).json({message: "Erreur lors de la récupération", detail: error.message});
    }
};

/**
 * Crée un nouveau professeur à partir des données fournies.
 * 
 * @param {Object} req - L'objet requête Express, contenant les données dans `req.body`.
 * @param {Object} res - L'objet réponse Express.
 * @returns {Promise<void>} Renvoie un message de succès et l'ID du professeur (code 201). Erreur code 500 en cas de problème.
 */
const addProfesseur = async (req, res) => {
    try {
        const data = req.body;
        const nouvelId = await Professeur.create(data);
        res.status(201).json({message: "Professeur créé avec succès !", id: nouvelId});
    }
    catch (error){
        res.status(500).json({message: "Erreur lors de la création", detail: error.message});
    }
};

/**
 * Met à jour les informations de base d'un professeur.
 * 
 * @param {Object} req - L'objet requête Express, contenant l'ID en param (`req.params.id`) et les data en corps (`req.body`).
 * @param {Object} res - L'objet réponse Express.
 * @returns {Promise<void>} Renvoie un message de succès (code 200) ou non trouvé (code 404). Erreur code 500 en cas de problème.
 */
const updateProfesseur = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const affectedRows = await Professeur.update(id, data);

        if (affectedRows === 0) {
            return res.status(404).json({ message: "Professeur introuvable ou aucune modification apportée." });
        }
        res.status(200).json({ message: "Professeur mis à jour avec succès !" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour", detail: error.message });
    }
};

/**
 * Supprime un professeur (et son utilisateur associé).
 * 
 * @param {Object} req - L'objet requête Express, contenant l'ID en param (`req.params.id`).
 * @param {Object} res - L'objet réponse Express.
 * @returns {Promise<void>} Renvoie un message de succès (code 200) ou non trouvé (code 404). Erreur code 500 en cas de problème.
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
        res.status(500).json({ message: "Erreur lors de la suppression", detail: error.message });
    }
};

module.exports = {
    getProfesseurs,
    addProfesseur,
    updateProfesseur,
    deleteProfesseur
};

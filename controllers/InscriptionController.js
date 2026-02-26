const Inscription = require('../models/InscriptionModel');

/**
 * Créer une nouvelle inscription.
 */
const createInscription = async (req, res) => {
    try {
        const data = req.body;
        // Validation basique
        if (!data.eleve_id || !data.annee_scolaire || !data.niveau || !data.lettre_classe) {
            return res.status(400).json({ message: "Les champs eleve_id, annee_scolaire, niveau et lettre_classe sont obligatoires." });
        }

        const nouvelId = await Inscription.create(data);
        res.status(201).json({ message: "Inscription créée avec succès !", id: nouvelId });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création de l'inscription", detail: error.message });
    }
};

/**
 * Récupérer l'historique des inscriptions pour un élève spécifique.
 */
const getInscriptionsByEleve = async (req, res) => {
    try {
        const eleve_id = req.params.eleve_id;
        const inscriptions = await Inscription.findByEleve(eleve_id);
        res.status(200).json(inscriptions);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération", detail: error.message });
    }
};

/**
 * Récupérer les élèves d'une classe pour une année spécifique.
 * Les paramètres peuvent être passés dans la query string : ?annee_scolaire=2025-2026&niveau=6&lettre=C
 */
const getInscriptionsByClasse = async (req, res) => {
    try {
        const { annee_scolaire, niveau, lettre_classe } = req.query;
        
        if (!annee_scolaire || !niveau || !lettre_classe) {
            return res.status(400).json({ message: "Veuillez fournir annee_scolaire, niveau et lettre_classe en paramètres (query)." });
        }

        const inscriptions = await Inscription.findByClasse(annee_scolaire, niveau, lettre_classe);
        res.status(200).json(inscriptions);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération", detail: error.message });
    }
};

/**
 * Supprimer une inscription.
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
        res.status(500).json({ message: "Erreur lors de la suppression", detail: error.message });
    }
};

module.exports = {
    createInscription,
    getInscriptionsByEleve,
    getInscriptionsByClasse,
    deleteInscription
};

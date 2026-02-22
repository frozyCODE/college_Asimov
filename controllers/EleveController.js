const Eleve = require('../models/EleveModel');

// Fonction pour lister les élèves
const getEleves = async (req, res) => {
    try {
        const liste = await Eleve.getAll();
        res.status(200).json(liste);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération", detail: error.message });
    }
};

// Fonction pour créer un élève
const addEleve = async (req, res) => {
    try {
        const data = req.body;
        const nouvelId = await Eleve.create(data);
        res.status(201).json({ message: "Élève créé avec succès !", id: nouvelId });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création", detail: error.message });
    }
};

// Fonction pour modifier un élève
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

// Fonction pour supprimer un élève
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
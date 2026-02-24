const Professeur = require('../models/ProfesseurModel');

const getProfesseurs = async (req, res) => {
    try {
        const liste = await Professeur.getAll();
        res.status(200).json(liste);
    }
    catch (error){
        res.status(500).json({message: "Erreur lors de la récupération", detail: error.message});
    }
};

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

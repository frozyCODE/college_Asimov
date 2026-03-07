const Parent = require("../models/ParentModel");

/**
 * Contrôleur pour gérer les parents.
 */
const getParents = async (req, res) => {
  try {
    const liste = await Parent.getAll();
    res.status(200).json(liste);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération",
        detail: error.message,
      });
  }
};

const addParent = async (req, res) => {
  try {
    const id = await Parent.create(req.body);
    res.status(201).json({ message: "Parent créé avec succès !", id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la création", detail: error.message });
  }
};

const lierEleve = async (req, res) => {
  try {
    const { eleve_id, parent_id } = req.body;
    if (!eleve_id || !parent_id) {
      return res
        .status(400)
        .json({ message: "eleve_id et parent_id sont requis." });
    }
    await Parent.linkToEleve(eleve_id, parent_id);
    res.status(201).json({ message: "Lien parent-élève créé avec succès !" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de la liaison", detail: error.message });
  }
};

const getMesEleves = async (req, res) => {
  try {
    // req.user.id est l'ID UTILISATEUR du parent connecté
    // On doit d'abord trouver son ID PARENT s'il n'est pas déjà dans le token
    // Mais pour simplifier ici, on suppose que c'est géré ou on cherche par Utilisateur
    // Pour l'instant, on liste tout via le param parent_id
    const { parent_id } = req.params;
    const eleves = await Parent.getElevesByParent(parent_id);
    res.status(200).json(eleves);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des enfants",
        detail: error.message,
      });
  }
};

module.exports = { getParents, addParent, lierEleve, getMesEleves };

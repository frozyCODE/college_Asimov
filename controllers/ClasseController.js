const Classe = require("../models/ClasseModel");

const getClasses = async (req, res, next) => {
  try {
    const classes = await Classe.findAll();
    res.status(200).json(classes);
  } catch (error) {
    next(error);
  }
};
const createClasse = async (req, res, next) => {
  try {
    const { annee_scolaire, niveau, lettre } = req.body;
    if (!annee_scolaire || !niveau || !lettre) {
      return res
        .status(400)
        .json({ message: "Année, niveau et lettre obligatoires." });
    }
    const nouvelId = await Classe.create({ annee_scolaire, niveau, lettre });
    res.status(201).json({ message: "Classe créée !", id: nouvelId });
  } catch (error) {
    next(error);
  }
};

const deleteClasse = async (req, res, next) => {
  try {
    await Classe.delete(req.params.id);
    res.status(200).json({ message: "Classe supprimée !" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getClasses, createClasse, deleteClasse };

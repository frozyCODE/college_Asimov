const Option = require("../models/OptionModel");

const getOptions = async (req, res) => {
  try {
    const options = await Option.getAll();
    res.status(200).json(options);
  } catch (error) {
    res
      .status(500)
      .json({
        message: "Erreur lors de la récupération des options",
        detail: error.message,
      });
  }
};

const addOption = async (req, res) => {
  try {
    const { nom } = req.body;
    if (!nom)
      return res
        .status(400)
        .json({ message: "Le nom de l'option est requis." });
    const id = await Option.create(nom);
    res.status(201).json({ message: "Option créée avec succès !", id });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors de l'ajout", detail: error.message });
  }
};

const choisirOption = async (req, res) => {
  try {
    const { eleve_id, option_id } = req.body;
    await Option.assignToEleve(eleve_id, option_id);
    res.status(201).json({ message: "Option assignée avec succès !" });
  } catch (error) {
    const status = error.message.includes("maximum") ? 400 : 500;
    res.status(status).json({ message: error.message });
  }
};

const desisterOption = async (req, res) => {
  try {
    const { eleve_id, option_id } = req.body;
    const affectedRows = await Option.removeFromEleve(eleve_id, option_id);
    if (affectedRows === 0)
      return res.status(404).json({ message: "Lien non trouvé." });
    res.status(200).json({ message: "Option retirée." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erreur lors du désistement", detail: error.message });
  }
};

module.exports = { getOptions, addOption, choisirOption, desisterOption };

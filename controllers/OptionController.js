const Option = require("../models/OptionModel");

/**
 * Contrôleur gérant les opérations sur les Options.
 * @module OptionController
 */

/**
 * Récupérer la liste complète de toutes les options du catalogue.
 *
 * @async
 * @function getOptions
 * @param {import('express').Request} req - L'objet de requête.
 * @param {import('express').Response} res - L'objet de réponse.
 * @returns {Promise<void>} 200 avec la liste des options, ou 500 en cas d'erreur.
 */
const getOptions = async (req, res) => {
  try {
    const options = await Option.getAll();
    res.status(200).json(options);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des options",
      detail: error.message,
    });
  }
};

/**
 * Créer une nouvelle option dans le catalogue (ex: Théâtre).
 *
 * @async
 * @function addOption
 * @param {import('express').Request} req - Contient le `nom` de la nouvelle option.
 * @param {import('express').Response} res - L'objet de réponse.
 * @returns {Promise<void>} 201 avec l'ID si succès, 400 si nom manquant, 500 si erreur.
 */
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

/**
 * Assigner une option à un élève. Gère la limite de 2 options par élève.
 *
 * @async
 * @function choisirOption
 * @param {import('express').Request} req - Contient `eleve_id` et `option_id`.
 * @param {import('express').Response} res - L'objet de réponse.
 * @returns {Promise<void>} 201 si succès, 400 si quota dépassé, 500 si erreur.
 */
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

/**
 * Résilier le choix d'une option pour un élève spécifique.
 *
 * @async
 * @function desisterOption
 * @param {import('express').Request} req - Contient `eleve_id` et `option_id`.
 * @param {import('express').Response} res - L'objet de réponse.
 * @returns {Promise<void>} 200 si retirée, 404 si lien inexistant.
 */
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

/**
 * Récupérer toutes les options auxquelles un élève est inscrit.
 *
 * @async
 * @function getOptionsByEleve
 * @param {import('express').Request} req - L'ID de l'élève en params (`eleve_id`).
 * @param {import('express').Response} res - L'objet de réponse.
 * @returns {Promise<void>} 200 avec la liste de ses options.
 */
const getOptionsByEleve = async (req, res) => {
  try {
    const eleve_id = req.params.eleve_id;
    const options = await Option.getByEleve(eleve_id);
    res.status(200).json(options);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération",
      detail: error.message,
    });
  }
};

/**
 * Récupérer tous les élèves inscrits dans une option précise.
 *
 * @async
 * @function getElevesByOption
 * @param {import('express').Request} req - L'ID de l'option en params (`option_id`).
 * @param {import('express').Response} res - L'objet de réponse.
 * @returns {Promise<void>} 200 avec la liste des élèves correspondants.
 */
const getElevesByOption = async (req, res) => {
  try {
    const option_id = req.params.option_id;
    const eleves = await Option.getElevesByOption(option_id);
    res.status(200).json(eleves);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération",
      detail: error.message,
    });
  }
};

/**
 * Supprimer définitivement une option du catalogue (Cascade sur les élèves implicite).
 *
 * @async
 * @function deleteOption
 * @param {import('express').Request} req - L'ID de l'option en params (`id`).
 * @param {import('express').Response} res - L'objet de réponse.
 * @returns {Promise<void>} 200 si succès, 404 si elle n'existait pas.
 */
const deleteOption = async (req, res) => {
  try {
    const id = req.params.id;
    const affectedRows = await Option.delete(id);
    if (affectedRows === 0)
      return res.status(404).json({ message: "Option introuvable." });
    res.status(200).json({ message: "Option supprimée avec succès !" });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la suppression",
      detail: error.message,
    });
  }
};

module.exports = {
  getOptions,
  addOption,
  choisirOption,
  desisterOption,
  getOptionsByEleve,
  getElevesByOption,
  deleteOption,
};

const Parent = require("../models/ParentModel");

/**
 * Contrôleur gérant les opérations sur les profils Parents.
 * @module ParentController
 */

/**
 * Récupérer la liste complète des parents avec leurs comptes utilisateurs.
 *
 * @async
 * @function getParents
 * @param {import('express').Request} req - L'objet de requête.
 * @param {import('express').Response} res - L'objet de réponse.
 * @returns {Promise<void>} 200 avec le catalogue des parents, ou 500 en cas d'erreur.
 */
const getParents = async (req, res) => {
  try {
    const liste = await Parent.getAll();
    res.status(200).json(liste);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération",
      detail: error.message,
    });
  }
};

/**
 * Créer un nouveau compte Parent (utilisateur + profil parent).
 *
 * @async
 * @function addParent
 * @param {import('express').Request} req - Contient les données (nom, prenom, email, password).
 * @param {import('express').Response} res - L'objet de réponse.
 * @returns {Promise<void>} 201 avec le nouvel ID, ou 500.
 */
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

/**
 * Associer un parent à un élève spécifique (Table de liaison).
 *
 * @async
 * @function lierEleve
 * @param {import('express').Request} req - Contient `eleve_id` et `parent_id`.
 * @param {import('express').Response} res - L'objet de réponse.
 * @returns {Promise<void>} 201 si le lien est créé, 400 s'il manque des paramètres.
 */
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

/**
 * Lister les élèves associés à un parent précis.
 * Très utile pour générer un tableau de bord parental.
 *
 * @async
 * @function getMesEleves
 * @param {import('express').Request} req - Inclut `parent_id` dans ses paramètres URl.
 * @param {import('express').Response} res - L'objet de réponse.
 * @returns {Promise<void>} 200 avec le tableau d'enfants.
 */
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
    res.status(500).json({
      message: "Erreur lors de la récupération des enfants",
      detail: error.message,
    });
  }
};

module.exports = { getParents, addParent, lierEleve, getMesEleves };

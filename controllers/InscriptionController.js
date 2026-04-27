const Inscription = require("../models/InscriptionModel");
const Eleve = require("../models/EleveModel");
const AppError = require("../utils/appError");

/**
 * Crée une nouvelle inscription liant un élève à une classe.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @throws {AppError} 400 - Si les champs obligatoires sont manquants.
 */
const createInscription = async (req, res, next) => {
  try {
    const { eleve_id, classe_id } = req.body;

    if (!eleve_id || !classe_id) {
      throw new AppError(
        "Les champs eleve_id et classe_id sont obligatoires.",
        400,
      );
    }

    const nouvelId = await Inscription.create({ eleve_id, classe_id });
    res
      .status(201)
      .json({ message: "Inscription créée avec succès !", id: nouvelId });
  } catch (error) {
    next(error);
  }
};

/**
 * Récupère l'historique complet des inscriptions pour un élève spécifique.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const getInscriptionsByEleve = async (req, res, next) => {
  try {
    const eleve_id = req.params.eleve_id;

    // Sécurité : Un élève ne peut voir que ses propres inscriptions
    if (req.user.role === "Eleve") {
      const profil = await Eleve.findByUtilisateurId(req.user.id);
      if (!profil || profil.id != eleve_id) {
        throw new AppError(
          "Accès interdit. Vous ne pouvez consulter que vos propres inscriptions.",
          403,
        );
      }
    }

    const inscriptions = await Inscription.findByEleve(eleve_id);
    res.status(200).json(inscriptions);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupère la liste des élèves inscrits dans une classe spécifique.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @throws {AppError} 400 - Si le paramètre classe_id est manquant.
 */
const getInscriptionsByClasse = async (req, res, next) => {
  try {
    const { classe_id } = req.params;

    if (!classe_id) {
      throw new AppError(
        "Veuillez fournir l'ID de la classe en paramètre.",
        400,
      );
    }

    const inscriptions = await Inscription.findByClasse(classe_id);
    res.status(200).json(inscriptions);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprime une inscription existante.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @throws {AppError} 404 - Si l'inscription n'existe pas.
 */
const deleteInscription = async (req, res, next) => {
  try {
    const id = req.params.id;
    const affectedRows = await Inscription.delete(id);

    if (affectedRows === 0) {
      throw new AppError("Inscription introuvable.", 404);
    }

    res.status(200).json({ message: "Inscription supprimée avec succès !" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInscription,
  getInscriptionsByEleve,
  getInscriptionsByClasse,
  deleteInscription,
};


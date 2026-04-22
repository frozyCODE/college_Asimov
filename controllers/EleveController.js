const Eleve = require("../models/EleveModel");
const AppError = require("../utils/appError");

/**
 * @module controllers/EleveController
 * @description Contrôleur gérant les opérations CRUD sur les Élèves.
 */

/**
 * Récupérer la liste complète de tous les élèves avec leurs options et parents.
 *
 * @async
 * @function getEleves
 * @param {import('express').Request} req - L'objet de requête Express.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware pour la gestion des erreurs.
 * @returns {Promise<void>} 200 avec le tableau de tous les élèves.
 */
const getEleves = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const [liste, total] = await Promise.all([
      Eleve.getPaginated(page, limit),
      Eleve.count(),
    ]);

    res.status(200).json({
      data: liste,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Créer un nouveau profil Élève (incluant la création de son compte Utilisateur).
 *
 * @async
 * @function addEleve
 * @param {import('express').Request} req - Les données de l'élève (`nom`, `prenom`, `email`, `password`, `identifiant_csv`).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware pour la gestion des erreurs.
 * @returns {Promise<void>} 201 avec l'ID du nouvel élève.
 */
const addEleve = async (req, res, next) => {
  try {
    const data = req.body;
    const nouvelId = await Eleve.create(data);
    res.status(201).json({ message: "Élève créé avec succès !", id: nouvelId });
  } catch (error) {
    next(error);
  }
};

/**
 * Modifier les informations personnelles de base d'un élève.
 * Les données entrantes sont nettoyées pour éviter les plantages SQL (remplacement de undefined par null).
 *
 * @async
 * @function updateEleve
 * @param {import('express').Request} req - Contient l'ID cible en `req.params.id` et les nouvelles données en `req.body`.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware pour la gestion des erreurs.
 * @returns {Promise<void>} 200 si la mise à jour a réussi.
 * @throws {AppError} 404 - Si l'élève est introuvable ou si aucune modification n'a été apportée.
 */
const updateEleve = async (req, res, next) => {
  try {
    const id = req.params.id;

    // 🛡️ SÉCURISATION DES DONNÉES :
    // On extrait les valeurs de req.body. Si une valeur n'est pas fournie par le client (undefined),
    // on force explicitement 'null' pour éviter l'erreur MySQL "Bind parameters must not contain undefined".
    const safeData = {
      nom: req.body.nom !== undefined ? req.body.nom : null,
      prenom: req.body.prenom !== undefined ? req.body.prenom : null,
      email: req.body.email !== undefined ? req.body.email : null,
      // Ajout des autres champs potentiels mentionnés dans tes commentaires
      identifiant_csv:
        req.body.identifiant_csv !== undefined
          ? req.body.identifiant_csv
          : null,
      password: req.body.password !== undefined ? req.body.password : null,
    };

    const affectedRows = await Eleve.update(id, safeData);

    if (affectedRows === 0) {
      throw new AppError(
        "Élève introuvable ou aucune modification apportée.",
        404,
      );
    }

    res.status(200).json({ message: "Élève mis à jour avec succès !" });
  } catch (error) {
    next(error);
  }
};

/**
 * Supprimer définitivement un élève et désactiver/supprimer son compte utilisateur.
 *
 * @async
 * @function deleteEleve
 * @param {import('express').Request} req - L'ID de l'élève cible en `req.params.id`.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - Middleware pour la gestion des erreurs.
 * @returns {Promise<void>} 200 si la suppression a réussi.
 * @throws {AppError} 404 - Si l'élève n'existe pas.
 */
const deleteEleve = async (req, res, next) => {
  try {
    const id = req.params.id;
    const affectedRows = await Eleve.delete(id);

    if (affectedRows === 0) {
      throw new AppError("Élève introuvable.", 404);
    }

    res.status(200).json({ message: "Élève supprimé avec succès !" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEleves,
  addEleve,
  updateEleve,
  deleteEleve,
};

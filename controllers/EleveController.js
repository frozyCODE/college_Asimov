const Eleve = require("../models/EleveModel");
const AppError = require("../utils/appError");

/**
 * Récupère la liste paginée de tous les élèves.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
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
 * Ajoute un nouvel élève et son compte utilisateur associé.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
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
 * Met à jour les informations d'un élève.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @throws {AppError} 404 - Si l'élève est introuvable.
 */
const updateEleve = async (req, res, next) => {
  try {
    const id = req.params.id;

    const safeData = {
      nom: req.body.nom !== undefined ? req.body.nom : null,
      prenom: req.body.prenom !== undefined ? req.body.prenom : null,
      email: req.body.email !== undefined ? req.body.email : null,
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
 * Récupère le profil complet de l'élève connecté.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const getProfile = async (req, res, next) => {
  try {
    const utilisateurId = req.user.id;
    const profil = await Eleve.findByUtilisateurId(utilisateurId);

    if (!profil) {
      throw new AppError("Profil élève non trouvé pour cet utilisateur.", 404);
    }

    res.status(200).json(profil);
  } catch (error) {
    next(error);
  }
};

/**
 * Récupère les détails d'un élève par son ID.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 */
const getEleveById = async (req, res, next) => {
  try {
    const id = req.params.id;
    
    // Sécurité : Un élève ne peut voir que son propre profil
    if (req.user.role === "Eleve") {
      const profil = await Eleve.findByUtilisateurId(req.user.id);
      if (!profil || profil.id != id) {
        throw new AppError("Accès interdit. Vous ne pouvez consulter que votre propre profil.", 403);
      }
    }

    // On utilise findByUtilisateurId ou on peut créer findById dans le modèle
    // Pour l'instant on va simuler ou chercher une méthode adaptée
    // Je vais vérifier si findById existe dans EleveModel
    const [rows] = await require("../config/db").execute(
      "SELECT e.*, u.nom, u.prenom, u.email FROM Eleves e JOIN Utilisateurs u ON e.utilisateur_id = u.id WHERE e.id = ?",
      [id]
    );

    if (rows.length === 0) {
      throw new AppError("Élève introuvable.", 404);
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

/**
 * Supprime un élève par son identifiant.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @throws {AppError} 404 - Si l'élève est introuvable.
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
  getProfile,
  getEleveById,
};


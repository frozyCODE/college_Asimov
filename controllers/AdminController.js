const Utilisateur = require("../models/userModel");
const response = require("../utils/responseHelper");
const AppError = require("../utils/appError");

/**
 * Crée un compte utilisateur pour le personnel de direction.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @throws {AppError} 400 - Si le rôle est invalide ou l'email déjà utilisé.
 */
const createAdminUser = async (req, res, next) => {
  try {
    const { nom, prenom, email, password, role } = req.body;

    if (role !== "Proviseur" && role !== "Secretariat") {
      throw new AppError(
        "Le rôle doit être soit 'Proviseur' soit 'Secretariat'.",
        400,
      );
    }

    const userExists = await Utilisateur.findByEmail(email);
    if (userExists) {
      throw new AppError("Cet email est déjà utilisé par un autre compte.", 400);
    }

    const data = { nom, prenom, email, password, role };
    const nouvelId = await Utilisateur.createAdmin(data);

    return response.success(res, 201, `${role} créé avec succès !`, {
      id: nouvelId,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createAdminUser };


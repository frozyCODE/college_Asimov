const Utilisateur = require("../models/userModel");
const response = require("../utils/responseHelper");
const AppError = require("../utils/appError");

/**
 * @module controllers/AdminController
 * @description Contrôleur gérant la création des comptes administratifs.
 */

/**
 * Créer un compte utilisateur pour le personnel de direction (Proviseur ou Secrétariat).
 *
 * @async
 * @function createAdminUser
 * @param {import('express').Request} req - L'objet de requête Express.
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @param {import('express').NextFunction} next - La fonction next d'Express.
 * @returns {Promise<void>} Renvoie un code 201 en cas de succès.
 * @throws {AppError} 400 - Si le rôle est invalide ou l'email est déjà pris.
 */
const createAdminUser = async (req, res, next) => {
  try {
    const { nom, prenom, email, password, role } = req.body;

    // 1. Double vérification métier du rôle
    if (role !== "Proviseur" && role !== "Secretariat") {
      throw new AppError(
        "Le rôle doit être soit 'Proviseur' soit 'Secretariat'.",
        400,
      );
    }

    // 2. Vérification si l'email existe déjà
    const userExists = await Utilisateur.findByEmail(email);
    if (userExists) {
      throw new AppError("Cet email est déjà utilisé par un autre compte.", 400);
    }

    // 3. Création de l'utilisateur
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

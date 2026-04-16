const Utilisateur = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

/**
 * @module controllers/authController
 * @description Contrôleur responsable de l'authentification globale.
 */

/**
 * Gère la connexion d'un utilisateur (Élève, Professeur, Direction, etc.).
 * Vérifie l'email, le mot de passe hashé, et génère un token JWT si succès.
 *
 * @async
 * @function login
 * @param {import('express').Request} req - L'objet requête Express, contenant l'email et le mot de passe dans `req.body`.
 * @param {import('express').Response} res - L'objet réponse Express.
 * @param {import('express').NextFunction} next - Middleware suivant.
 * @returns {Promise<void>} 200 avec le Token JWT et les infos publiques de l'utilisateur.
 * @throws {AppError} 401 - Si l'email ou le mot de passe est incorrect.
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await Utilisateur.findByEmail(email);

    if (!user) {
      throw new AppError("Email ou mot de passe incorrect.", 401);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      throw new AppError("Email ou mot de passe incorrect.", 401);
    }

    const payload = {
      id: user.id,
      role: user.role,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    });

    return response.success(res, 200, "Connexion réussie !", {
      token,
      utilisateur: {
        id: user.id,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};

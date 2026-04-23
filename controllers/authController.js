const Utilisateur = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

/**
 * Gère la connexion des utilisateurs.
 * 
 * @async
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {import('express').NextFunction} next 
 * @throws {AppError} 401 - Si les identifiants sont incorrects.
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

    return res.status(200).json({
      success: true,
      message: "Connexion réussie !",
      data: {
        token,
        utilisateur: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
};


const Utilisateur = require("../models/userModel");

/**
 * Contrôleur gérant la création des comptes administratifs.
 * @module AdminController
 */

/**
 * Créer un compte utilisateur pour le personnel de direction (Proviseur ou Secrétariat).
 *
 * @async
 * @function createAdminUser
 * @param {import('express').Request} req - L'objet de requête Express contenant (nom, prenom, email, password, role).
 * @param {import('express').Response} res - L'objet de réponse Express.
 * @returns {Promise<void>} 201 si succès avec l'ID, 400 si validation échoue, ou 500 en cas d'erreur.
 */
const createAdminUser = async (req, res) => {
  try {
    const { nom, prenom, email, password, role } = req.body;

    // 1. Validations basiques
    if (!nom || !prenom || !email || !password || !role) {
      return res.status(400).json({
        message:
          "Tous les champs (nom, prenom, email, password, role) sont obligatoires.",
      });
    }

    if (role !== "Proviseur" && role !== "Secretariat") {
      return res.status(400).json({
        message: "Le rôle doit être soit 'Proviseur' soit 'Secretariat'.",
      });
    }

    // 2. Vérification si l'email existe déjà
    const userExists = await Utilisateur.findByEmail(email);
    if (userExists) {
      return res
        .status(400)
        .json({ message: "Cet email est déjà utilisé par un autre compte." });
    }

    // 3. Création de l'utilisateur
    const data = { nom, prenom, email, password, role };
    const nouvelId = await Utilisateur.createAdmin(data);

    res
      .status(201)
      .json({ message: `${role} créé avec succès !`, id: nouvelId });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création du compte administrateur",
      detail: error.message,
    });
  }
};

module.exports = { createAdminUser };

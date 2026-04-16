const db = require("../config/db");

/**
 * @class UtilisateurModel
 * @description Modèle pour gérer l'interaction générique avec la table Utilisateurs. Utilisé principalement pour l'authentification et la création d'administrateurs.
 */
class UtilisateurModel {
  /**
   * Recherche un utilisateur complet dans la base de données à partir de son adresse email.
   *
   * @async
   * @static
   * @param {string} email - L'adresse email de l'utilisateur à rechercher.
   * @returns {Promise<Object|undefined>} Une promesse avec l'objet utilisateur (id, nom, prenom, email, password_hash, role) ou `undefined`.
   */
  static async findByEmail(email) {
    const [rows] = await db.execute(
      `SELECT id, nom, prenom, email, password_hash, role 
             FROM Utilisateurs 
             WHERE email = ?`,
      [email],
    );
    return rows[0];
  }

  /**
   * Crée un utilisateur de type direction (Proviseur ou Secretariat) directement.
   * Ne lie l'utilisateur à aucune autre table puisqu'ils n'ont pas de profil spécifique.
   *
   * @async
   * @static
   * @param {Object} data - Les données du nouvel administrateur.
   * @param {string} data.nom - Le nom de l'administrateur.
   * @param {string} data.prenom - Le prénom de l'administrateur.
   * @param {string} data.email - L'email de l'administrateur.
   * @param {string} data.password - Le mot de passe en clair (sera hashé).
   * @param {string} data.role - Le rôle ("Proviseur" ou "Secretariat").
   * @returns {Promise<number>} L'ID de l'utilisateur nouvellement créé.
   */
  static async createAdmin(data) {
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const [result] = await db.execute(
      `INSERT INTO Utilisateurs (nom, prenom, email, password_hash, role) VALUES (?, ?, ?, ?, ?)`,
      [data.nom, data.prenom, data.email, hashedPassword, data.role],
    );
    return result.insertId;
  }
}

module.exports = UtilisateurModel;

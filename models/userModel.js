const db = require("../config/db");

/**
 * Modèle pour la gestion générique des utilisateurs.
 */
class UtilisateurModel {
  /**
   * Trouve un utilisateur par son email.
   * 
   * @async
   * @param {string} email 
   * @returns {Promise<Object|null>}
   */
  static async findByEmail(email) {
    const [rows] = await db.execute(
      `SELECT id, nom, prenom, email, password_hash, role 
             FROM Utilisateurs 
             WHERE email = ?`,
      [email],
    );
    return rows[0] || null;
  }

  /**
   * Crée un compte utilisateur de type direction.
   * 
   * @async
   * @param {Object} data - { nom, prenom, email, password, role }
   * @returns {Promise<number>}
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


const db = require("../config/db");
const bcrypt = require("bcrypt");

/**
 * Modèle pour gérer les Parents.
 */
class ParentModel {
  /**
   * Récupère la liste de tous les parents.
   */
  static async getAll() {
    const [rows] = await db.execute(`
            SELECT p.id, u.nom, u.prenom, u.email 
            FROM Parents p
            JOIN Utilisateurs u ON p.utilisateur_id = u.id`);
    return rows;
  }

  /**
   * Crée un nouveau parent.
   */
  static async create(data) {
    const connexion = await db.getConnection();
    try {
      await connexion.beginTransaction();
      const hashedPassword = await bcrypt.hash(data.password, 10);

      // 1. Création Utilisateur avec rôle 'Parent'
      const [userResult] = await connexion.execute(
        `INSERT INTO Utilisateurs (nom, prenom, email, password_hash, role) VALUES (?, ?, ?, ?, 'Parent')`,
        [data.nom, data.prenom, data.email, hashedPassword],
      );
      const newUserId = userResult.insertId;

      // 2. Création dans la table Parents
      const [parentResult] = await connexion.execute(
        `INSERT INTO Parents (utilisateur_id) VALUES (?)`,
        [newUserId],
      );

      await connexion.commit();
      return parentResult.insertId;
    } catch (error) {
      await connexion.rollback();
      throw error;
    } finally {
      connexion.release();
    }
  }

  /**
   * Lie un parent à un élève.
   */
  static async linkToEleve(eleveId, parentId) {
    await db.execute(
      "INSERT INTO Eleve_Parent (eleve_id, parent_id) VALUES (?, ?)",
      [eleveId, parentId],
    );
    return true;
  }

  /**
   * Récupère les élèves liés à un parent.
   */
  static async getElevesByParent(parentId) {
    const [rows] = await db.execute(
      `
            SELECT e.id, u.nom, u.prenom 
            FROM Eleves e
            JOIN Utilisateurs u ON e.utilisateur_id = u.id
            JOIN Eleve_Parent ep ON e.id = ep.eleve_id
            WHERE ep.parent_id = ?`,
      [parentId],
    );
    return rows;
  }
}

module.exports = ParentModel;

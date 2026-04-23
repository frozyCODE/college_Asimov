const db = require("../config/db");
const bcrypt = require("bcrypt");

/**
 * Modèle pour la gestion des parents.
 */
class ParentModel {
  /**
   * Récupère tous les parents.
   * 
   * @async
   * @returns {Promise<Array<Object>>}
   */
  static async getAll() {
    const [rows] = await db.execute(`
            SELECT p.id, u.nom, u.prenom, u.email 
            FROM Parents p
            JOIN Utilisateurs u ON p.utilisateur_id = u.id`);
    return rows;
  }

  /**
   * Crée un nouveau parent (Transaction).
   * 
   * @async
   * @param {Object} data - { nom, prenom, email, password }
   * @returns {Promise<number>} L'ID du parent créé.
   */
  static async create(data) {
    const connexion = await db.getConnection();
    try {
      await connexion.beginTransaction();
      const hashedPassword = await bcrypt.hash(data.password, 10);

      const [userResult] = await connexion.execute(
        `INSERT INTO Utilisateurs (nom, prenom, email, password_hash, role) VALUES (?, ?, ?, ?, 'Parent')`,
        [data.nom, data.prenom, data.email, hashedPassword],
      );
      const newUserId = userResult.insertId;

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
   * 
   * @async
   * @param {number|string} eleveId 
   * @param {number|string} parentId 
   * @returns {Promise<boolean>}
   */
  static async linkToEleve(eleveId, parentId) {
    await db.execute(
      "INSERT INTO Eleve_Parent (eleve_id, parent_id) VALUES (?, ?)",
      [eleveId, parentId],
    );
    return true;
  }

  /**
   * Récupère les élèves d'un parent.
   * 
   * @async
   * @param {number|string} parentId 
   * @returns {Promise<Array<Object>>}
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

  /**
   * Récupère les parents d'un élève.
   * 
   * @async
   * @param {number|string} eleveId 
   * @returns {Promise<Array<Object>>}
   */
  static async getParentsByEleve(eleveId) {
    const [rows] = await db.execute(`
            SELECT p.id, u.nom, u.prenom, u.email 
            FROM Parents p
            JOIN Utilisateurs u ON p.utilisateur_id = u.id
            JOIN Eleve_Parent ep ON p.id = ep.parent_id
            WHERE ep.eleve_id = ?`,
      [eleveId],
    );
    return rows;
  }
}

module.exports = ParentModel;


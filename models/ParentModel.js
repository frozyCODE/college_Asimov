const db = require("../config/db");
const bcrypt = require("bcrypt");

/**
 * Modèle pour la gestion des parents.
 */
class ParentModel {
  /**
   * Récupère tous les parents avec la liste de leurs enfants associés.
   *
   * @async
   * @returns {Promise<Array<Object>>}
   */
  static async getAll() {
    const [rows] = await db.execute(`
            SELECT p.id, u.nom, u.prenom, u.email,
                   GROUP_CONCAT(CONCAT(ue.prenom, ' ', ue.nom) SEPARATOR ', ') as enfants
            FROM Parents p
            JOIN Utilisateurs u ON p.utilisateur_id = u.id
            LEFT JOIN Eleve_Parent ep ON p.id = ep.parent_id
            LEFT JOIN Eleves e ON ep.eleve_id = e.id
            LEFT JOIN Utilisateurs ue ON e.utilisateur_id = ue.id
            GROUP BY p.id`);
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
    const [rows] = await db.execute(
      `
            SELECT p.id, u.nom, u.prenom, u.email 
            FROM Parents p
            JOIN Utilisateurs u ON p.utilisateur_id = u.id
            JOIN Eleve_Parent ep ON p.id = ep.parent_id
            WHERE ep.eleve_id = ?`,
      [eleveId],
    );
    return rows;
  }

  /**
   * Récupère les informations d'un parent à partir de l'ID de son compte utilisateur.
   *
   * @async
   * @param {number} userId - L'ID de la table Utilisateurs.
   * @returns {Promise<Object|null>} Le parent trouvé ou null.
   */
  static async findByUserId(userId) {
    const [rows] = await db.execute(
      `SELECT p.id, p.utilisateur_id, u.nom, u.prenom, u.email 
     FROM Parents p
     JOIN Utilisateurs u ON p.utilisateur_id = u.id
     WHERE p.utilisateur_id = ?`,
      [userId],
    );
    return rows[0] || null;
  }

  /**
   * Supprime un parent et son compte utilisateur associé.
   *
   * @async
   * @param {number|string} parentId - ID du parent à supprimer.
   * @returns {Promise<boolean>}
   * @throws {Error} Si le parent n'existe pas ou erreur SQL.
   */
  static async delete(parentId) {
    const connexion = await db.getConnection();
    try {
      await connexion.beginTransaction();

      // 1. Récupérer l'id utilisateur associé
      const [parent] = await connexion.execute(
        "SELECT utilisateur_id FROM Parents WHERE id = ?",
        [parentId],
      );
      if (parent.length === 0) throw new Error("Parent non trouvé");
      const userId = parent[0].utilisateur_id;

      // 2. Supprimer les liaisons parents-élèves
      await connexion.execute("DELETE FROM Eleve_Parent WHERE parent_id = ?", [
        parentId,
      ]);

      // 3. Supprimer le parent
      await connexion.execute("DELETE FROM Parents WHERE id = ?", [parentId]);

      // 4. Supprimer l'utilisateur (le compte)
      await connexion.execute("DELETE FROM Utilisateurs WHERE id = ?", [
        userId,
      ]);

      await connexion.commit();
      return true;
    } catch (error) {
      await connexion.rollback();
      throw error;
    } finally {
      connexion.release();
    }
  }
}

module.exports = ParentModel;

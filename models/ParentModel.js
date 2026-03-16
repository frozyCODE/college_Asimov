const db = require("../config/db");
const bcrypt = require("bcrypt");

/**
 * Modèle pour interagir avec les données des Parents.
 * Gère la création synchronisée d'un Utilisateur/Parent et les liaisons avec les élèves.
 * @class ParentModel
 */
class ParentModel {
  /**
   * Récupère la liste de tous les parents avec leurs informations de base.
   *
   * @async
   * @returns {Promise<Array<Object>>} Tableau contenant les parents (id, nom, prenom, email).
   */
  static async getAll() {
    const [rows] = await db.execute(`
            SELECT p.id, u.nom, u.prenom, u.email 
            FROM Parents p
            JOIN Utilisateurs u ON p.utilisateur_id = u.id`);
    return rows;
  }

  /**
   * Ajoute un nouveau parent dans la base de données.
   * Utilise une transaction pour insérer dans `Utilisateurs` (rôle 'Parent') puis dans `Parents`.
   *
   * @async
   * @param {Object} data - Les données du parent.
   * @param {string} data.nom - Le nom du parent.
   * @param {string} data.prenom - Le prénom du parent.
   * @param {string} data.email - L'email du parent.
   * @param {string} data.password - Le mot de passe en clair (sera hashé).
   * @returns {Promise<number>} L'ID du parent dans la table `Parents`.
   * @throws {Error} Si l'insertion échoue.
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
   * Lie un parent à un élève spécifique dans la table de jointure `Eleve_Parent`.
   *
   * @async
   * @param {number|string} eleveId - L'ID de l'élève.
   * @param {number|string} parentId - L'ID du parent.
   * @returns {Promise<boolean>} TRUE si la liaison a réussi.
   */
  static async linkToEleve(eleveId, parentId) {
    await db.execute(
      "INSERT INTO Eleve_Parent (eleve_id, parent_id) VALUES (?, ?)",
      [eleveId, parentId],
    );
    return true;
  }

  /**
   * Récupère la liste des élèves affiliés à un parent spécifique.
   *
   * @async
   * @param {number|string} parentId - L'ID du parent.
   * @returns {Promise<Array<Object>>} Tableau contenant les ID, noms et prénoms des enfants.
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

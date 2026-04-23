const db = require("../config/db");

/**
 * Modèle pour la gestion des inscriptions (liaison Élèves <-> Classes).
 */
class InscriptionModel {
  /**
   * Crée une nouvelle inscription.
   * 
   * @async
   * @param {Object} data - { eleve_id, classe_id }
   * @returns {Promise<number>} L'ID de l'inscription.
   */
  static async create(data) {
    const { eleve_id, classe_id } = data;
    const [result] = await db.execute(
      `INSERT INTO Inscriptions (eleve_id, classe_id) VALUES (?, ?)`,
      [eleve_id, classe_id],
    );
    return result.insertId;
  }

  /**
   * Récupère l'historique des inscriptions d'un élève.
   * 
   * @async
   * @param {number|string} eleve_id 
   * @returns {Promise<Array<Object>>}
   */
  static async findByEleve(eleve_id) {
    const [rows] = await db.execute(
      `SELECT 
        i.id, 
        i.eleve_id, 
        c.annee_scolaire, 
        c.niveau, 
        c.lettre AS lettre_classe 
       FROM Inscriptions i
       JOIN Classes c ON i.classe_id = c.id
       WHERE i.eleve_id = ? 
       ORDER BY c.annee_scolaire DESC`,
      [eleve_id],
    );
    return rows;
  }

  /**
   * Récupère les inscriptions pour une classe donnée.
   * 
   * @async
   * @param {number|string} classe_id 
   * @returns {Promise<Array<Object>>}
   */
  static async findByClasse(classe_id) {
    const [rows] = await db.execute(
      `SELECT i.*, u.nom, u.prenom, u.email 
       FROM Inscriptions i
       JOIN Eleves e ON i.eleve_id = e.id
       JOIN Utilisateurs u ON e.utilisateur_id = u.id
       WHERE i.classe_id = ?`,
      [classe_id],
    );
    return rows;
  }

  /**
   * Supprime une inscription.
   * 
   * @async
   * @param {number|string} id 
   * @returns {Promise<number>} Nombre de lignes affectées.
   */
  static async delete(id) {
    const [result] = await db.execute(`DELETE FROM Inscriptions WHERE id = ?`, [
      id,
    ]);
    return result.affectedRows;
  }
}

module.exports = InscriptionModel;


const db = require("../config/db");

/**
 * Modèle pour la gestion des classes.
 */
class ClasseModel {
  /**
   * Récupère toutes les classes rangées par année scolaire.
   * 
   * @async
   * @returns {Promise<Array<Object>>}
   */
  static async findAll() {
    const [rows] = await db.execute(
      `SELECT * FROM Classes ORDER BY annee_scolaire DESC, niveau ASC, lettre ASC`,
    );
    return rows;
  }

  /**
   * Crée une nouvelle classe.
   * 
   * @async
   * @param {Object} data - { annee_scolaire, niveau, lettre }
   * @returns {Promise<number>} L'ID de la classe créée.
   */
  static async create(data) {
    const { annee_scolaire, niveau, lettre } = data;
    const [result] = await db.execute(
      `INSERT INTO Classes (annee_scolaire, niveau, lettre) VALUES (?, ?, ?)`,
      [annee_scolaire, niveau, lettre],
    );
    return result.insertId;
  }

  /**
   * Supprime une classe.
   * 
   * @async
   * @param {number|string} id 
   * @returns {Promise<number>} Le nombre de lignes affectées.
   */
  static async delete(id) {
    const [result] = await db.execute(`DELETE FROM Classes WHERE id = ?`, [id]);
    return result.affectedRows;
  }
}
module.exports = ClasseModel;


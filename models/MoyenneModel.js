const db = require("../config/db");

/**
 * Modèle pour la gestion des moyennes semestrielles.
 */
class MoyenneModel {
  /**
   * Valide une moyenne par le proviseur.
   * 
   * @async
   * @param {number|string} id 
   * @returns {Promise<number>}
   */
  static async validate(id) {
    const [result] = await db.execute(
      "UPDATE Moyennes_Semestrielles SET validee_par_proviseur = TRUE WHERE id = ?",
      [id],
    );
    return result.affectedRows;
  }

  /**
   * Crée une nouvelle moyenne.
   * 
   * @async
   * @param {Object} data - { inscription_id, semestre, moyenne_generale }
   * @returns {Promise<number>}
   */
  static async create(data) {
    const { inscription_id, semestre, moyenne_generale } = data;
    const [result] = await db.execute(
      "INSERT INTO Moyennes_Semestrielles (inscription_id, semestre, moyenne_generale) VALUES (?, ?, ?)",
      [inscription_id, semestre, moyenne_generale],
    );
    return result.insertId;
  }

  /**
   * Récupère les moyennes d'une inscription.
   * 
   * @async
   * @param {number|string} inscriptionId 
   * @returns {Promise<Array<Object>>}
   */
  static async findByInscription(inscriptionId) {
    const [rows] = await db.execute(
      "SELECT * FROM Moyennes_Semestrielles WHERE inscription_id = ?",
      [inscriptionId],
    );
    return rows;
  }

  /**
   * Trouve une moyenne par inscription et semestre.
   * 
   * @async
   * @param {number|string} inscription_id 
   * @param {number} semestre 
   * @returns {Promise<Object|null>}
   */
  static async findByInscriptionAndSemester(inscription_id, semestre) {
    const [rows] = await db.execute(
      "SELECT * FROM Moyennes_Semestrielles WHERE inscription_id = ? AND semestre = ?",
      [inscription_id, semestre],
    );
    return rows[0] || null;
  }

  /**
   * Supprime une moyenne.
   * 
   * @async
   * @param {number|string} id 
   * @returns {Promise<number>}
   */
  static async delete(id) {
    const [result] = await db.execute(
      "DELETE FROM Moyennes_Semestrielles WHERE id = ?",
      [id],
    );
    return result.affectedRows;
  }
}

module.exports = MoyenneModel;


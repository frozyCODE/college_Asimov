/**
 * @module models/MoyenneModel
 */
const db = require("../config/db");

class MoyenneModel {
  /**
   * Passe le statut d'une moyenne à 'validée'.
   * @param {number} id - ID de la moyenne
   * @returns {Promise<number>} Nombre de lignes modifiées
   */
  static async validate(id) {
    const [result] = await db.execute(
      "UPDATE Moyennes_Semestrielles SET validee_par_proviseur = TRUE WHERE id = ?",
      [id],
    );
    return result.affectedRows;
  }

  static async create(data) {
    const { inscription_id, semestre, moyenne_generale } = data;
    const [result] = await db.execute(
      "INSERT INTO Moyennes_Semestrielles (inscription_id, semestre, moyenne_generale) VALUES (?, ?, ?)",
      [inscription_id, semestre, moyenne_generale],
    );
    return result.insertId;
  }

  static async findByInscription(inscriptionId) {
    const [rows] = await db.execute(
      "SELECT * FROM Moyennes_Semestrielles WHERE inscription_id = ?",
      [inscriptionId],
    );
    return rows;
  }
}

module.exports = MoyenneModel;

const db = require("../config/db");
const AppError = require("../utils/appError");

/**
 * Modèle pour la gestion des options du catalogue.
 */
class OptionModel {
  /**
   * Récupère toutes les options.
   * 
   * @async
   * @returns {Promise<Array<Object>>}
   */
  static async getAll() {
    const [rows] = await db.execute("SELECT * FROM Options ORDER BY nom ASC");
    return rows;
  }

  /**
   * Crée une nouvelle option.
   * 
   * @async
   * @param {string} nom 
   * @returns {Promise<number>}
   */
  static async create(nom) {
    const [result] = await db.execute("INSERT INTO Options (nom) VALUES (?)", [
      nom,
    ]);
    return result.insertId;
  }

  /**
   * Assigne une option à un élève.
   * 
   * @async
   * @param {number|string} eleveId 
   * @param {number|string} optionId 
   * @returns {Promise<boolean>}
   * @throws {AppError} 400 - Si le quota est dépassé.
   */
  static async assignToEleve(eleveId, optionId) {
    const [countResult] = await db.execute(
      "SELECT COUNT(*) as total FROM Eleve_Option WHERE eleve_id = ?",
      [eleveId],
    );

    if (countResult[0].total >= 2) {
      throw new AppError("L'élève a déjà 2 options (maximum autorisé).", 400);
    }

    await db.execute(
      "INSERT INTO Eleve_Option (eleve_id, option_id) VALUES (?, ?)",
      [eleveId, optionId],
    );
    return true;
  }

  /**
   * Retire une option d'un élève.
   * 
   * @async
   * @param {number|string} eleveId 
   * @param {number|string} optionId 
   * @returns {Promise<number>}
   */
  static async removeFromEleve(eleveId, optionId) {
    const [result] = await db.execute(
      "DELETE FROM Eleve_Option WHERE eleve_id = ? AND option_id = ?",
      [eleveId, optionId],
    );
    return result.affectedRows;
  }

  /**
   * Récupère les options d'un élève.
   * 
   * @async
   * @param {number|string} eleveId 
   * @returns {Promise<Array<Object>>}
   */
  static async getByEleve(eleveId) {
    const [rows] = await db.execute(
      `SELECT o.* FROM Options o
       JOIN Eleve_Option eo ON o.id = eo.option_id
       WHERE eo.eleve_id = ?`,
      [eleveId],
    );
    return rows;
  }

  /**
   * Récupère les élèves d'une option.
   * 
   * @async
   * @param {number|string} optionId 
   * @returns {Promise<Array<Object>>}
   */
  static async getElevesByOption(optionId) {
    const [rows] = await db.execute(
      `SELECT e.id as eleve_id, u.nom, u.prenom, u.email 
       FROM Eleves e
       JOIN Utilisateurs u ON e.utilisateur_id = u.id
       JOIN Eleve_Option eo ON e.id = eo.eleve_id
       WHERE eo.option_id = ?`,
      [optionId],
    );
    return rows;
  }

  /**
   * Supprime une option du catalogue.
   * 
   * @async
   * @param {number|string} id 
   * @returns {Promise<number>}
   */
  static async delete(id) {
    const [result] = await db.execute("DELETE FROM Options WHERE id = ?", [id]);
    return result.affectedRows;
  }
}

module.exports = OptionModel;


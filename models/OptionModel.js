const db = require("../config/db");

/**
 * Modèle pour gérer les options (ex: informatique, langues) et leur lien avec les élèves.
 */
class OptionModel {
  /**
   * Récupère toutes les options disponibles.
   */
  static async getAll() {
    const [rows] = await db.execute("SELECT * FROM Options ORDER BY nom ASC");
    return rows;
  }

  /**
   * Crée une nouvelle option.
   * @param {string} nom - Le nom de l'option.
   */
  static async create(nom) {
    const [result] = await db.execute("INSERT INTO Options (nom) VALUES (?)", [
      nom,
    ]);
    return result.insertId;
  }

  /**
   * Assigne une option à un élève.
   * Vérifie si l'élève n'a pas déjà 2 options.
   */
  static async assignToEleve(eleveId, optionId) {
    const [countResult] = await db.execute(
      "SELECT COUNT(*) as total FROM Eleve_Option WHERE eleve_id = ?",
      [eleveId],
    );

    if (countResult[0].total >= 2) {
      throw new Error("L'élève a déjà 2 options (maximum autorisé).");
    }

    await db.execute(
      "INSERT INTO Eleve_Option (eleve_id, option_id) VALUES (?, ?)",
      [eleveId, optionId],
    );
    return true;
  }

  /**
   * Supprime le lien entre un élève et une option.
   */
  static async removeFromEleve(eleveId, optionId) {
    const [result] = await db.execute(
      "DELETE FROM Eleve_Option WHERE eleve_id = ? AND option_id = ?",
      [eleveId, optionId],
    );
    return result.affectedRows;
  }
}

module.exports = OptionModel;

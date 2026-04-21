const db = require("../config/db");
const AppError = require("../utils/appError");

/**
 * @class OptionModel
 * @description Modèle pour gérer les options (ex: informatique, langues) et leur lien avec les élèves.
 */
class OptionModel {
  /**
   * Récupère la liste de toutes les options disponibles dans le catalogue.
   *
   * @async
   * @static
   * @returns {Promise<Array<Object>>} Tableau contenant toutes les options triées par nom.
   */
  static async getAll() {
    const [rows] = await db.execute("SELECT * FROM Options ORDER BY nom ASC");
    return rows;
  }

  /**
   * Crée une nouvelle option.
   *
   * @async
   * @static
   * @param {string} nom - Le nom de la nouvelle option.
   * @returns {Promise<number>} L'ID de l'option nouvellement insérée.
   */
  static async create(nom) {
    const [result] = await db.execute("INSERT INTO Options (nom) VALUES (?)", [
      nom,
    ]);
    return result.insertId;
  }

  /**
   * Assigne une option à un élève spécifique.
   * Vérifie d'abord en base de données si l'élève n'a pas déjà atteint la limite de 2 options.
   *
   * @async
   * @static
   * @param {number|string} eleveId - L'ID de l'élève.
   * @param {number|string} optionId - L'ID de l'option à attribuer.
   * @returns {Promise<boolean>} TRUE si l'assignation a réussi.
   * @throws {AppError} 400 - Si l'élève a déjà 2 options.
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
   * Supprime le lien (désistement) entre un élève et une option.
   *
   * @async
   * @static
   * @param {number|string} eleveId - L'ID de l'élève.
   * @param {number|string} optionId - L'ID de l'option.
   * @returns {Promise<number>} Le nombre de lignes affectées (1 si succès, 0 si lien introuvable).
   */
  static async removeFromEleve(eleveId, optionId) {
    const [result] = await db.execute(
      "DELETE FROM Eleve_Option WHERE eleve_id = ? AND option_id = ?",
      [eleveId, optionId],
    );
    return result.affectedRows;
  }

  /**
   * Récupère la liste des options choisies par un élève spécifique.
   *
   * @async
   * @static
   * @param {number|string} eleveId - L'ID de l'élève.
   * @returns {Promise<Array<Object>>} Tableau contenant les options de l'élève.
   */
  static async getByEleve(eleveId) {
    const [rows] = await db.execute(
      `SELECT o.* FROM Options o
       JOIN Eleve_Option eo ON o.id = eo.option_idx
       WHERE eo.eleve_id = ?`,
      [eleveId],
    );
    return rows;
  }

  /**
   * Récupère la liste de tous les élèves inscrits à une option spécifique.
   *
   * @async
   * @static
   * @param {number|string} optionId - L'ID de l'option.
   * @returns {Promise<Array<Object>>} Tableau d'objets contenant les informations des élèves.
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
   * Supprime définitivement une option du système.
   * En base de données, la clé étrangère en cascade se charge de supprimer les liens Eleve_Option.
   *
   * @async
   * @static
   * @param {number|string} id - L'ID de l'option à supprimer.
   * @returns {Promise<number>} Le nombre de lignes affectées (1 si succès).
   */
  static async delete(id) {
    const [result] = await db.execute("DELETE FROM Options WHERE id = ?", [id]);
    return result.affectedRows;
  }
}

module.exports = OptionModel;

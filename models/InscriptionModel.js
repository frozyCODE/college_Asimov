/**
 * @module models/InscriptionModel
 */
const db = require("../config/db");

/**
 * @class InscriptionModel
 * @description Modèle pour interagir avec la table Inscriptions.
 * Gère le pont entre un élève et sa classe (elle-même définie par une année, un niveau et une lettre).
 */
class InscriptionModel {
  /**
   * Crée une nouvelle inscription liant un élève à une classe.
   *
   * @async
   * @static
   * @param {Object} data - Les données d'inscription.
   * @param {number|string} data.eleve_id - L'identifiant de l'élève.
   * @param {number|string} data.classe_id - L'identifiant de la classe.
   * @returns {Promise<number>} L'ID de la nouvelle inscription créée.
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
   * Récupère l'historique complet des inscriptions d'un élève.
   * Effectue une jointure avec la table Classes pour renvoyer un objet formaté pour le client.
   *
   * @async
   * @static
   * @param {number|string} eleve_id - L'identifiant de l'élève.
   * @returns {Promise<Array<Object>>} Liste des inscriptions avec les infos de la classe (année, niveau, lettre).
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
   * Récupère toutes les inscriptions pour une classe spécifique.
   * Ramène également les informations d'identité de l'élève et de l'utilisateur.
   *
   * @async
   * @static
   * @param {number|string} classe_id - L'identifiant de la classe.
   * @returns {Promise<Array<Object>>} Liste détaillée des élèves inscrits dans cette classe.
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
   * Supprime définitivement une inscription.
   *
   * @async
   * @static
   * @param {number|string} id - L'ID de l'inscription à supprimer.
   * @returns {Promise<number>} Le nombre de lignes affectées (1 si succès).
   */
  static async delete(id) {
    const [result] = await db.execute(`DELETE FROM Inscriptions WHERE id = ?`, [
      id,
    ]);
    return result.affectedRows;
  }
}

module.exports = InscriptionModel;

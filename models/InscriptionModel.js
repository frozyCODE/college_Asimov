const db = require('../config/db');

/**
 * @class InscriptionModel
 * @description Modèle pour interagir avec la table Inscriptions. Gère les liens entre les élèves et leurs classes pour une année scolaire.
 */
class InscriptionModel {
    /**
     * Crée une nouvelle inscription pour un élève.
     * 
     * @async
     * @static
     * @param {Object} data - Les données d'inscription.
     * @param {number} data.eleve_id - L'identifiant de l'élève.
     * @param {string} data.annee_scolaire - L'année (ex: '2023-2024').
     * @param {number} data.niveau - Le niveau d'étude (ex: 6, 5, 4, 3).
     * @param {string} data.lettre_classe - La lettre de la classe (ex: 'A', 'B').
     * @returns {Promise<number>} L'ID de la nouvelle inscription créée.
     */
    static async create(data) {
        const { eleve_id, annee_scolaire, niveau, lettre_classe } = data;
        const [result] = await db.execute(
            `INSERT INTO Inscriptions (eleve_id, annee_scolaire, niveau, lettre_classe) 
             VALUES (?, ?, ?, ?)`,
            [eleve_id, annee_scolaire, niveau, lettre_classe]
        );
        return result.insertId;
    }

    /**
     * Récupère l'historique complet des inscriptions d'un élève.
     * 
     * @async
     * @static
     * @param {number|string} eleve_id - L'identifiant de l'élève.
     * @returns {Promise<Array<Object>>} Liste des inscriptions triées par année descendante.
     */
    static async findByEleve(eleve_id) {
        const [rows] = await db.execute(
            `SELECT * FROM Inscriptions WHERE eleve_id = ? ORDER BY annee_scolaire DESC`,
            [eleve_id]
        );
        return rows;
    }

    /**
     * Récupère toutes les inscriptions pour une classe spécifique.
     * Récupère également les informations d'identité de l'élève via jointure.
     * 
     * @async
     * @static
     * @param {string} annee_scolaire - L'année scolaire ciblée.
     * @param {number|string} niveau - Le niveau (ex: 3).
     * @param {string} lettre_classe - La lettre (ex: 'C').
     * @returns {Promise<Array<Object>>} Liste détaillée des élèves inscrits dans cette classe.
     */
    static async findByClasse(annee_scolaire, niveau, lettre_classe) {
        const [rows] = await db.execute(
            `SELECT i.*, u.nom, u.prenom, u.email 
             FROM Inscriptions i
             JOIN Eleves e ON i.eleve_id = e.id
             JOIN Utilisateurs u ON e.utilisateur_id = u.id
             WHERE i.annee_scolaire = ? AND i.niveau = ? AND i.lettre_classe = ?`,
            [annee_scolaire, niveau, lettre_classe]
        );
        return rows;
    }

    /**
     * Supprime définitivement une inscription.
     * 
     * @async
     * @static
     * @param {number|string} id - L'ID de l'inscription à supprimer.
     * @returns {Promise<number>} Le nombre de lignes supprimées (1 si succès).
     */
    static async delete(id) {
        const [result] = await db.execute(
            `DELETE FROM Inscriptions WHERE id = ?`,
            [id]
        );
        return result.affectedRows;
    }
}

module.exports = InscriptionModel;

const db = require('../config/db');

/**
 * Modèle pour interagir avec la table Inscriptions.
 */
class InscriptionModel {
    /**
     * Crée une nouvelle inscription pour un élève
     * @param {Object} data 
     * @returns {Promise<number>} ID de la nouvelle inscription
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
     * Récupère toutes les inscriptions d'un élève donné.
     * @param {number} eleve_id 
     * @returns {Promise<Array>}
     */
    static async findByEleve(eleve_id) {
        const [rows] = await db.execute(
            `SELECT * FROM Inscriptions WHERE eleve_id = ? ORDER BY annee_scolaire DESC`,
            [eleve_id]
        );
        return rows;
    }

    /**
     * Récupère toutes les inscriptions pour une classe spécifique dans une année scolaire donnée.
     * @param {string} annee_scolaire 
     * @param {number} niveau 
     * @param {string} lettre_classe 
     * @returns {Promise<Array>} Liste détaillée des élèves inscrits
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
     * Supprime une inscription par son ID.
     * @param {number} id 
     * @returns {Promise<number>} Nombre de lignes affectées
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

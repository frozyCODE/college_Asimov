const db = require('../config/db');

/**
 * Modèle pour gérer l'interaction avec la base de données concernant les Stages.
 */
class StageModel {
    /**
     * Ajoute une nouvelle recherche de stage pour un élève.
     * 
     * @param {Object} data - Les données de la recherche de stage.
     * @param {number} data.eleve_id - L'ID de l'élève.
     * @param {string} data.nom_entreprise - Le nom de l'entreprise.
     * @param {string} [data.statut='En attente'] - Le statut de la recherche.
     * @returns {Promise<number>} L'ID de la recherche de stage nouvellement créée.
     */
    static async addRecherche(data) {
        const [result] = await db.execute(
            `INSERT INTO Recherches_Stage (eleve_id, nom_entreprise, resultat) VALUES (?, ?, ?)`,
            [data.eleve_id, data.nom_entreprise, data.resultat || 'En attente']
        );
        return result.insertId;
    }
    /**
     * Récupère la liste des élèves ayant effectué plus de 15 recherches de stage.
     * 
     * @returns {Promise<Array<Object>>} Tableau contenant les élèves en alerte.
     */
    static async getAlertes() {
        const [rows] = await db.execute(`
            SELECT e.id AS eleve_id, u.nom, u.prenom, COUNT(rs.id) AS quantite_contactee
            FROM Eleves e
            JOIN Utilisateurs u ON e.utilisateur_id = u.id
            JOIN Recherches_Stage rs ON e.id = rs.eleve_id
            GROUP BY e.id, u.nom, u.prenom
            HAVING COUNT(rs.id) > 15
        `);
        return rows;
    }
}

module.exports = StageModel;
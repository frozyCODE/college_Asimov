const db = require('../config/db');

/**
 * Modèle pour la gestion des stages.
 */
class StageModel {
    /**
     * Ajoute une recherche de stage.
     * 
     * @async
     * @param {Object} data - { eleve_id, nom_entreprise, resultat }
     * @returns {Promise<number>}
     */
    static async addRecherche(data) {
        const [result] = await db.execute(
            `INSERT INTO Recherches_Stage (eleve_id, nom_entreprise, resultat) VALUES (?, ?, ?)`,
            [data.eleve_id, data.nom_entreprise, data.resultat || 'En attente']
        );
        return result.insertId;
    }

    /**
     * Récupère les élèves en alerte (trop de recherches sans succès).
     * 
     * @async
     * @returns {Promise<Array<Object>>}
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
const db = require('../config/db');


class MoyenneModel {
    /**
     * Ajoute une nouvelle moyenne semestrielle pour une inscription donnée.
     * 
     * @param {Object} data - Les données de la moyenne.
     * @param {number} data.inscription_id - L'identifiant de l'inscription de l'élève.
     * @param {number} data.semestre - Le numéro du semestre (1 ou 2).
     * @param {number} data.moyenne_generale - La moyenne générale obtenue (ex: 14.50).
     * @returns {Promise<number>} L'identifiant (ID) de la nouvelle moyenne créée en base de données.
     */
    static async create(data) {
        const { inscription_id, semestre, moyenne_generale } = data;
        const [result] = await db.execute(
            `INSERT INTO Moyennes_Semestrielles (inscription_id, semestre, moyenne_generale) 
             VALUES (?, ?, ?)`,
            [inscription_id, semestre, moyenne_generale]
        );
        return result.insertId;
    }

    /**
     * Récupère les moyennes d'une inscription spécifique.
     * 
     * @param {number|string} inscription_id - L'identifiant de l'inscription.
     * @returns {Promise<Array<Object>>} Une promesse résolue avec le tableau des moyennes.
     */
    static async findByInscription(inscription_id) {
        const [rows] = await db.execute(
            `SELECT * FROM Moyennes_Semestrielles WHERE inscription_id = ? ORDER BY semestre ASC`,
            [inscription_id]
        );
        return rows;
    }

    /**
     * Valide une moyenne (action du proviseur).
     * 
     * @param {number|string} id - L'identifiant de la moyenne à valider.
     * @returns {Promise<number>} Le nombre de lignes affectées (1 si succès, 0 si non trouvé).
     */
    static async validerParProviseur(id) {
        const [result] = await db.execute(
            `UPDATE Moyennes_Semestrielles SET validee_par_proviseur = TRUE WHERE id = ?`,
            [id]
        );
        return result.affectedRows;
    }
}

module.exports = MoyenneModel;

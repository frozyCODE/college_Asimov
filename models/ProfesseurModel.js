const db = require('../config/db');
const bcrypt = require('bcrypt');

/**
 * Modèle pour la gestion des professeurs.
 */
class ProfesseurModel {
    /**
     * Récupère tous les professeurs actifs.
     * 
     * @async
     * @returns {Promise<Array<Object>>}
     */
    static async getAll() {
        const [rows] = await db.execute(`
            SELECT p.id, u.nom, u.prenom, u.email
            FROM Professeurs p
            JOIN Utilisateurs u ON p.utilisateur_id = u.id`);
        return rows;
    }

    /**
     * Crée un nouveau professeur (Transaction).
     * 
     * @async
     * @param {Object} data - { nom, prenom, email, password }
     * @returns {Promise<number>} L'ID du professeur créé.
     */
    static async create(data) {
        const connexion = await db.getConnection();
        try {
            await connexion.beginTransaction();
            const hashedPassword = await bcrypt.hash(data.password, 10);

            const [userResult] = await connexion.execute(
                `INSERT INTO Utilisateurs (nom, prenom, email, password_hash, role) VALUES (?, ?, ?, ?, 'Professeur')`,
                [data.nom, data.prenom, data.email, hashedPassword]
            );
            const newUserId = userResult.insertId;

            const [profResult] = await connexion.execute(
                `INSERT INTO Professeurs (utilisateur_id) VALUES (?)`,
                [newUserId]
            );
            
            await connexion.commit();
            return profResult.insertId;

        } catch (error) {
            await connexion.rollback();
            throw error;
        } finally {
            connexion.release();
        }
    }

    /**
     * Met à jour les informations d'un professeur.
     * 
     * @async
     * @param {number|string} id 
     * @param {Object} data 
     * @returns {Promise<number>}
     */
    static async update(id, data) {
        const [result] = await db.execute(
            `UPDATE Utilisateurs u 
             JOIN Professeurs p ON u.id = p.utilisateur_id 
             SET u.nom = ?, u.prenom = ?, u.email = ? 
             WHERE p.id = ?`,
            [data.nom, data.prenom, data.email, id]
        );
        return result.affectedRows;
    }

    /**
     * Supprime un professeur et son compte associé.
     * 
     * @async
     * @param {number|string} id 
     * @returns {Promise<number>}
     */
    static async delete(id) {
        const [result] = await db.execute(
            `DELETE u FROM Utilisateurs u 
             JOIN Professeurs p ON u.id = p.utilisateur_id 
             WHERE p.id = ?`, 
            [id]
        );
        return result.affectedRows;
    }
}

module.exports = ProfesseurModel;


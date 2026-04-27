const db = require("../config/db");
const bcrypt = require("bcrypt");

/**
 * Modèle pour la gestion des élèves et de leurs comptes utilisateurs.
 */
class EleveModel {
    /**
     * Récupère la liste complète des élèves avec leurs infos utilisateurs.
     * 
     * @async
     * @returns {Promise<Array<Object>>}
     */
    static async getAll() {
        const [rows] = await db.execute(`
            SELECT e.id, u.nom, u.prenom, u.email, e.identifiant_csv 
            FROM Eleves e
            JOIN Utilisateurs u ON e.utilisateur_id = u.id`);
        return rows;
    }

    /**
     * Récupère une liste paginée d'élèves.
     * 
     * @async
     * @param {number} page 
     * @param {number} limit 
     * @returns {Promise<Array<Object>>}
     */
    static async getPaginated(page = 1, limit = 20) {
        const offset = (page - 1) * limit;
        const [rows] = await db.execute(`
            SELECT e.id, u.nom, u.prenom, u.email, e.identifiant_csv 
            FROM Eleves e
            JOIN Utilisateurs u ON e.utilisateur_id = u.id
            ORDER BY u.nom ASC, u.prenom ASC
            LIMIT ? OFFSET ?`, 
            [limit, offset]
        );
        return rows;
    }

    /**
     * Compte le nombre total d'élèves.
     * 
     * @async
     * @returns {Promise<number>}
     */
    static async count() {
        const [rows] = await db.execute(`SELECT COUNT(*) as total FROM Eleves`);
        return rows[0].total;
    }

    /**
     * Trouve un élève par l'ID de son compte utilisateur.
     * 
     * @async
     * @param {number|string} utilisateurId 
     * @returns {Promise<Object|null>}
     */
    static async findByUtilisateurId(utilisateurId) {
        const [rows] = await db.execute(`
            SELECT e.*, u.nom, u.prenom, u.email 
            FROM Eleves e
            JOIN Utilisateurs u ON e.utilisateur_id = u.id
            WHERE e.utilisateur_id = ?`,
            [utilisateurId]
        );
        return rows[0] || null;
    }

    /**
     * Crée un nouvel élève et son compte utilisateur associé (Transaction).
     * 
     * @async
     * @param {Object} data - { nom, prenom, email, password, identifiant_csv }
     * @returns {Promise<number>} L'ID de l'élève créé.
     */
    static async create(data) {
        const connexion = await db.getConnection();
        try {
            await connexion.beginTransaction();
            const hashedPassword = await bcrypt.hash(data.password, 10);

            const [userResult] = await connexion.execute(
                `INSERT INTO Utilisateurs (nom, prenom, email, password_hash, role) VALUES (?, ?, ?, ?, 'Eleve')`,
                [data.nom, data.prenom, data.email, hashedPassword]
            );
            const newUserId = userResult.insertId;

            const [eleveResult] = await connexion.execute(
                `INSERT INTO Eleves (utilisateur_id, identifiant_csv) VALUES (?, ?)`,
                [newUserId, data.identifiant_csv]
            );
            
            await connexion.commit();
            return eleveResult.insertId;

        } catch (error) {
            await connexion.rollback();
            throw error;
        } finally {
            connexion.release();
        }
    }

    /**
     * Met à jour les informations d'un élève.
     * 
     * @async
     * @param {number|string} id 
     * @param {Object} data 
     * @returns {Promise<number>} Nombre de lignes affectées.
     */
    static async update(id, data) {
        const [result] = await db.execute(
            `UPDATE Utilisateurs u 
             JOIN Eleves e ON u.id = e.utilisateur_id 
             SET u.nom = ?, u.prenom = ?, u.email = ?, e.identifiant_csv = ? 
             WHERE e.id = ?`,
            [data.nom, data.prenom, data.email, data.identifiant_csv, id]
        );
        return result.affectedRows;
    }

    /**
     * Supprime un élève et son compte utilisateur.
     * 
     * @async
     * @param {number|string} id 
     * @returns {Promise<number>} Nombre de lignes affectées.
     */
    static async delete(id) {
        const [result] = await db.execute(
            `DELETE u FROM Utilisateurs u 
             JOIN Eleves e ON u.id = e.utilisateur_id 
             WHERE e.id = ?`, 
            [id]
        );
        return result.affectedRows;
    }
}

module.exports = EleveModel;


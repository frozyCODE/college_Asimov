const db = require("../config/db");
const bcrypt = require("bcrypt");

/**
 * Modèle pour interagir avec les données des élèves dans la base de données.
 * Gère le CRUD des élèves qui inclut la gestion synchronisée de la table Utilisateurs et Eleves via des transactions.
 * @class EleveModel
 */
class EleveModel {
    /**
     * Récupère la liste complète des élèves.
     * Effectue une jointure avec Utilisateurs pour obtenir l'identité complète.
     * 
     * @async
     * @static
     * @returns {Promise<Array<Object>>} Tableau contenant tous les élèves (id, nom, prenom, email, identifiant_csv).
     */
    static async getAll() {
        const [rows] = await db.execute(`
            SELECT e.id, u.nom, u.prenom, u.email, e.identifiant_csv 
            FROM Eleves e
            JOIN Utilisateurs u ON e.utilisateur_id = u.id`);
        return rows;
    }

    /**
     * Récupère une page d'élèves.
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
     */
    static async count() {
        const [rows] = await db.execute(`SELECT COUNT(*) as total FROM Eleves`);
        return rows[0].total;
    }

    /**
     * Crée un nouvel élève dans le système (Utilisateur + Profil Élève).
     * Utilise une transaction SQL pour garantir que le profil et le compte sont créés simultanément.
     * 
     * @async
     * @static
     * @param {Object} data - Les données de l'élève.
     * @param {string} data.nom - Nom de famille.
     * @param {string} data.prenom - Prénom.
     * @param {string} data.email - Adresse email (identifiant unique).
     * @param {string} data.password - Mot de passe en clair.
     * @param {string} data.identifiant_csv - Identifiant externe (Import Scolinfo).
     * @returns {Promise<number>} L'ID de l'élève nouvellement créé dans la table Eleves.
     */
    static async create(data) {
        const connexion = await db.getConnection();
        try {
            await connexion.beginTransaction();
            const hashedPassword = await bcrypt.hash(data.password, 10);

            // 1. Création de l'Utilisateur
            const [userResult] = await connexion.execute(
                `INSERT INTO Utilisateurs (nom, prenom, email, password_hash, role) VALUES (?, ?, ?, ?, 'Eleve')`,
                [data.nom, data.prenom, data.email, hashedPassword]
            );
            const newUserId = userResult.insertId;

            // 2. Création de l'Élève rattaché
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
     * Met à jour les informations d'identité d'un élève.
     * 
     * @async
     * @static
     * @param {number|string} id - L'ID de l'élève dans la table Eleves.
     * @param {Object} data - Les nouvelles données.
     * @returns {Promise<number>} Le nombre de lignes modifiées (1 si succès).
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
     * Supprime définitivement un élève et l'utilisateur associé.
     * 
     * @async
     * @static
     * @param {number|string} id - L'ID de l'élève à supprimer.
     * @returns {Promise<number>} Le nombre de lignes supprimées (1 si succès).
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

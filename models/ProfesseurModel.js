const db = require('../config/db');
const bcrypt = require('bcrypt');

/**
 * @class ProfesseurModel
 * @description Modèle pour gérer l'interaction avec la base de données concernant les Professeurs. Gère la création synchronisée d'un Utilisateur/Professeur.
 */
class ProfesseurModel {
    /**
     * Récupère la liste de tous les professeurs actifs.
     * Effectue une jointure avec la table Utilisateurs pour obtenir l'identité complète.
     * 
     * @async
     * @static
     * @returns {Promise<Array<Object>>} Tableau contenant la liste des professeurs (id, nom, prenom, email).
     */
    static async getAll() {
        const [rows] = await db.execute(`
            SELECT p.id, u.nom, u.prenom, u.email
            FROM Professeurs p
            JOIN Utilisateurs u ON p.utilisateur_id = u.id`);
        return rows;
    }

    /**
     * Crée un nouveau professeur dans le système (Utilisateur + Profil Professeur).
     * Utilise une transaction SQL pour garantir l'intégrité des données.
     * 
     * @async
     * @static
     * @param {Object} data - Les données du professeur.
     * @param {string} data.nom - Le nom du professeur.
     * @param {string} data.prenom - Le prénom du professeur.
     * @param {string} data.email - L'email du professeur.
     * @param {string} data.password - Le mot de passe de connexion.
     * @returns {Promise<number>} L'ID du professeur nouvellement créé dans la table Professeurs.
     * @throws {Error} Erreur SQL en cas d'échec de transaction ou doublon.
     */
    static async create(data) {
        const connexion = await db.getConnection();
        try {
            await connexion.beginTransaction();
            const hashedPassword = await bcrypt.hash(data.password, 10);

            // 1. Création de l'Utilisateur avec le rôle Professeur
            const [userResult] = await connexion.execute(
                `INSERT INTO Utilisateurs (nom, prenom, email, password_hash, role) VALUES (?, ?, ?, ?, 'Professeur')`,
                [data.nom, data.prenom, data.email, hashedPassword]
            );
            const newUserId = userResult.insertId;

            // 2. Création Professeur lié à l'utilisateur
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
     * Met à jour les informations d'identité d'un professeur.
     * 
     * @async
     * @static
     * @param {number|string} id - L'ID de la table Professeurs cible.
     * @param {Object} data - Les nouvelles données.
     * @param {string} data.nom - Nouveau nom.
     * @param {string} data.prenom - Nouveau prénom.
     * @param {string} data.email - Nouvel email.
     * @returns {Promise<number>} Le nombre de lignes modifiées (1 si succès).
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
     * Supprime définitivement un professeur et l'utilisateur associé.
     * 
     * @async
     * @static
     * @param {number|string} id - L'ID du professeur à supprimer.
     * @returns {Promise<number>} Le nombre de lignes supprimées (1 si succès).
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

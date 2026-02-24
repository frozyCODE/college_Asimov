const db = require('../config/db');
const bcrypt = require('bcrypt');

/**
 * Modèle pour interagir avec les données des élèves dans la base de données.
 * Gère le CRUD des élèves qui inclut la gestion de la table Utilisateurs et Eleves conjointement.
 */
class EleveModel {
    /**
     * Récupère la liste de tous les élèves.
     * Effectue une jointure entre la table Eleves et la table Utilisateurs.
     * 
     * @returns {Promise<Array<Object>>} Une promesse résolue avec le tableau d'élèves.
     */
    static async getAll() {
        // On joint Eleves et Utilisateurs pour avoir le nom et le prénom
        const [rows] = await db.execute(`
            SELECT e.id, u.nom, u.prenom, u.email, e.identifiant_csv 
            FROM Eleves e
            JOIN Utilisateurs u ON e.utilisateur_id = u.id`);
        return rows;
    }
    
    /**
     * Ajoute un nouvel élève dans la base de données.
     * Crée d'abord un Utilisateur avec le rôle 'Eleve' puis le lie à la table Eleves.
     * Gère la transaction SQL pour assurer la cohérence des données.
     * 
     * @param {Object} data - Les données de l'élève à créer.
     * @param {string} data.nom - Le nom de l'élève.
     * @param {string} data.prenom - Le prénom de l'élève.
     * @param {string} data.email - L'email de l'élève.
     * @param {string} data.password - Le mot de passe en clair de l'élève.
     * @param {string} data.identifiant_csv - L'identifiant externe (ex: issu d'un export CSV).
     * @returns {Promise<number>} L'ID de l'élève créé.
     * @throws {Error} Si l'insertion échoue.
     */
    static async create(data) {
        const connexion = await db.getConnection();
        try{
            await connexion.beginTransaction();
            const hashedPassword = await bcrypt.hash(data.password, 10);

            // 1 Creation Utilisateur
            const [userResult] = await connexion.execute(
                `INSERT INTO Utilisateurs (nom, prenom, email, password_hash, role) VALUES (?, ?, ?, ?, 'Eleve')`,
                [data.nom, data.prenom, data.email, hashedPassword]
            );
            const newUserId = userResult.insertId;

            // 2 Création Eleve lié à l'utilisateur
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
     * Met à jour les informations de base (nom, prénom, email) de l'utilisateur lié à l'élève.
     * 
     * @param {number|string} id - L'ID de la table Eleves pour lequel on souhaite mettre à jour les infos.
     * @param {Object} data - Les nouvelles données.
     * @param {string} data.nom - Le nouveau nom.
     * @param {string} data.prenom - Le nouveau prénom.
     * @param {string} data.email - Le nouvel email.
     * @returns {Promise<number>} Le nombre de lignes affectées (1 si succès, 0 si non trouvé).
     */
    static async update(id, data){
        const [result] = await db.execute(
            `UPDATE Utilisateurs u 
             JOIN Eleves e ON u.id = e.utilisateur_id 
             SET u.nom = ?, u.prenom = ?, u.email = ? 
             WHERE e.id = ?`,
            [data.nom, data.prenom, data.email, id]
        );
        // On retourne le nombre de lignes affectées 1 = succès 0 = élève n'existe pas.
        return result.affectedRows;
    }
    /**
     * Supprime un élève et l'utilisateur associé grâce à la suppression en cascade.
     * 
     * @param {number|string} id - L'ID de la table Eleves à supprimer.
     * @returns {Promise<number>} Le nombre de lignes affectées.
     */
    static async delete(id){
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

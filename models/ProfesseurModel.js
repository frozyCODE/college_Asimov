const db = require('../config/db');
const bcrypt = require('bcrypt');

class ProfesseurModel {
    // READ : Récupérer tous les professeurs
    static async getAll() {
        // On joint Eleves et Utilisateurs pour avoir le nom et le prénom
        const [rows] = await db.execute(`
            SELECT p.id, u.nom, u.prenom, u.email
            FROM Professeurs p
            JOIN Utilisateurs u ON p.utilisateur_id = u.id`);
        return rows;
    }

    // CREATE : Ajouter un professeur
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
    // UPDATE : Modifier un professeur (ses infos de base)
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
    // DELETE : Supprimer un professeur
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

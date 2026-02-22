const db = require('../config/db');

const bcrypt = require('bcrypt');

class EleveModel {
    // READ : Récupérer tous les élèves
    static async getAll() {
        // On joint Eleves et Utilisateurs pour avoir le nom et le prénom
        const [rows] = await db.execute(`
            SELECT e.id, u.nom, u.prenom, u.email, e.identifiant_csv 
            FROM Eleves e
            JOIN Utilisateurs u ON e.utilisateur_id = u.id`);
        return rows;
    }
    
    // CREATE : Ajouter un élève
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
    // UPDATE : Modifier un élève
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
    // DELETE : Supprimer un élève
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

const db = require('../config/db');

/**
 * Modèle pour gérer l'interaction avec la base de données concernant les Utilisateurs.
 * Utilisé principalement pour l'authentification (login).
 */
class UtilisateurModel {
    /**
     * Recherche un utilisateur dans la base de données à partir de son adresse email.
     * 
     * @param {string} email - L'adresse email de l'utilisateur à rechercher.
     * @returns {Promise<Object|undefined>} Une promesse résolue avec l'objet de l'utilisateur s'il est trouvé, sinon `undefined`.
     */
    static async findByEmail(email) {
        const [rows] = await db.execute(
            `SELECT id, nom, prenom, email, password_hash, role 
             FROM Utilisateurs 
             WHERE email = ?`,
            [email]
        );
        return rows[0]; 
    }
}

module.exports = UtilisateurModel;
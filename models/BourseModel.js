const db = require("../config/db");

class BourseModel {
  /**
   * Créer une demande de bourse pour un élève
   * @param {number} eleveId
   * @returns {Promise<boolean>}
   */
  static async creerDemande(eleveId) {
    const query = `INSERT INTO Demandes_Bourse (eleve_id, statut) VALUES (?, 'En attente')`;
    const [result] = await db.execute(query, [eleveId]);
    return result.affectedRows > 0;
  }

  /**
   * Récupérer la demande d'un élève (s'il en a fait une)
   * @param {number} eleveId
   * @returns {Promise<Object|null>}
   */
  static async getDemandeByEleve(eleveId) {
    const query = `SELECT * FROM Demandes_Bourse WHERE eleve_id = ? ORDER BY date_demande DESC LIMIT 1`;
    const [rows] = await db.execute(query, [eleveId]);
    return rows.length > 0 ? rows[0] : null;
  }

  /**
   * Récupérer toutes les demandes pour l'administration
   * @returns {Promise<Array>}
   */
  static async getAllDemandes() {
    const query = `
        SELECT d.*, e.identifiant_csv, u.nom, u.prenom 
        FROM Demandes_Bourse d
        JOIN Eleves e ON d.eleve_id = e.id
        JOIN Utilisateurs u ON e.utilisateur_id = u.id
        ORDER BY d.date_demande DESC
        `;
    const [rows] = await db.execute(query);
    return rows;
  }

  /**
   * Mettre à jour le statut d'une demande par le proviseur/secrétariat
   * @param {number} demandeId
   * @param {string} statut ('Acceptée' ou 'Refusée')
   * @param {number} traiteePar (ID de l'utilisateur qui valide)
   * @returns {Promise<boolean>}
   */
  static async updateStatut(demandeId, statut, traiteePar) {
    const query = `
        UPDATE Demandes_Bourse 
        SET statut = ?, traitee_par = ?, date_traitement = CURRENT_DATE 
        WHERE id = ?
        `;
    const [result] = await db.execute(query, [statut, traiteePar, demandeId]);
    return result.affectedRows > 0;
  }
}

module.exports = BourseModel;

const db = require("../config/db");

/**
 * Modèle gérant la logique de données pour les stages et recherches associés.
 */
class StageModel {
  /**
   * Enregistre une nouvelle démarche de recherche de stage.
   *
   * @async
   * @param {Object} data - Objet contenant { eleve_id, nom_entreprise, resultat }.
   * @returns {Promise<number>} L'identifiant unique de la recherche créée.
   */
  static async addRecherche(data) {
    const [result] = await db.execute(
      `INSERT INTO Recherches_Stage (eleve_id, nom_entreprise, resultat) VALUES (?, ?, ?)`,
      [data.eleve_id, data.nom_entreprise, data.resultat || "En attente"],
    );
    return result.insertId;
  }

  /**
   * Identifie les élèves de 3ème n'ayant pas atteint le quota de stages requis.
   *
   * @async
   * @param {number} [seuil=2] - Le nombre minimum de stages à avoir pour ne pas être en alerte.
   * @returns {Promise<Array<Object>>} Liste des élèves en alerte avec leurs statistiques.
   */
  static async getAlertesQuota3eme(seuil = 2) {
    const [rows] = await db.execute(
      `
            SELECT 
                u.nom, u.prenom, u.email,
                CONCAT(c.niveau, c.lettre) AS classe,
                COUNT(DISTINCT cs.id) AS nombre_stages,
                COUNT(DISTINCT rs.id) AS nombre_recherches
            FROM Eleves e
            JOIN Utilisateurs u ON e.utilisateur_id = u.id
            JOIN Inscriptions i ON e.id = i.eleve_id
            JOIN Classes c ON i.classe_id = c.id
            LEFT JOIN Conventions_Stage cs ON e.id = cs.eleve_id
            LEFT JOIN Recherches_Stage rs ON e.id = rs.eleve_id
            WHERE c.niveau = 3
            GROUP BY e.id, c.id
            HAVING nombre_stages < ?
            ORDER BY nombre_stages ASC, nombre_recherches DESC
        `,
      [seuil],
    );
    return rows;
  }

  /**
   * Récupère les élèves ayant effectué un grand nombre de recherches sans succès.
   *
   * @async
   * @returns {Promise<Array<Object>>} Liste des élèves ayant plus de 15 contacts sans résultat.
   */
  static async getAlertesVolumeRecherches() {
    const [rows] = await db.execute(`
            SELECT e.id AS eleve_id, u.nom, u.prenom, COUNT(rs.id) AS quantite_contactee
            FROM Eleves e
            JOIN Utilisateurs u ON e.utilisateur_id = u.id
            JOIN Recherches_Stage rs ON e.id = rs.eleve_id
            GROUP BY e.id, u.nom, u.prenom
            HAVING COUNT(rs.id) > 15
        `);
    return rows;
  }
}

module.exports = StageModel;

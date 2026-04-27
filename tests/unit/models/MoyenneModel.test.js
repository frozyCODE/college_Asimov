import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * @module tests/unit/models/MoyenneModel.test
 * @description Tests unitaires pour le modèle MoyenneModel.
 * Utilise vi.spyOn pour isoler la BDD de manière sûre avec les modules CommonJS.
 */

const MoyenneModel = require("../../../models/MoyenneModel");
const db = require("../../../config/db");

describe("MoyenneModel", () => {
  beforeEach(() => {
    // Nettoyer l'historique des mocks
    vi.clearAllMocks();
    // Intercepter toutes les requêtes SQL (sécurité pour éviter de taper la vraie BDD)
    vi.spyOn(db, "execute").mockImplementation(async () => [[]]);
  });

  afterEach(() => {
    // Restaurer les méthodes originales après chaque test
    vi.restoreAllMocks();
  });

  /**
   * @test {MoyenneModel.create}
   * @description Teste la création d'une moyenne et la requête SQL associée.
   */
  describe("create", () => {
    it("devrait exécuter la requête INSERT et retourner l'identifiant (insertId) de la nouvelle moyenne", async () => {
      // Préparation des données de test
      const donneesMoyenne = {
        inscription_id: 1,
        semestre: 1,
        moyenne_generale: 15.5,
      };

      // Simulation du retour
      vi.spyOn(db, "execute").mockResolvedValue([{ insertId: 42 }]);

      // Exécution de la méthode
      const resultat = await MoyenneModel.create(donneesMoyenne);

      // Vérifications
      expect(db.execute).toHaveBeenCalledTimes(1);
      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO Moyennes_Semestrielles"),
        [1, 1, 15.5],
      );
      expect(resultat).toBe(42);
    });
  });

  /**
   * @test {MoyenneModel.findByInscription}
   * @description Teste la récupération des moyennes pour un étudiant donné.
   */
  describe("findByInscription", () => {
    it("devrait retourner la liste des moyennes correspondantes à l'ID d'inscription", async () => {
      // Données simulées
      const lignesRetournees = [{ id: 10, moyenne_generale: 14.0 }];
      vi.spyOn(db, "execute").mockResolvedValue([lignesRetournees]);

      // Exécution
      const resultat = await MoyenneModel.findByInscription(1);

      // Vérifications
      expect(db.execute).toHaveBeenCalledTimes(1);
      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM Moyennes_Semestrielles"),
        [1],
      );
      expect(resultat).toEqual(lignesRetournees);
    });
  });

  /**
   * @test {MoyenneModel.validate}
   * @description Teste la mise à jour (validation) d'une moyenne par le proviseur.
   */
  describe("validate", () => {
    it("devrait exécuter la requête UPDATE et retourner le nombre de lignes affectées", async () => {
      // Simulation d'une mise à jour réussie (1 ligne affectée)
      vi.spyOn(db, "execute").mockResolvedValue([{ affectedRows: 1 }]);

      // Exécution
      const resultat = await MoyenneModel.validate(10);

      // Vérifications
      expect(db.execute).toHaveBeenCalledTimes(1);
      expect(db.execute).toHaveBeenCalledWith(
        expect.stringContaining(
          "UPDATE Moyennes_Semestrielles SET validee_par_proviseur = TRUE",
        ),
        [10],
      );
      expect(resultat).toBe(1);
    });
  });
});

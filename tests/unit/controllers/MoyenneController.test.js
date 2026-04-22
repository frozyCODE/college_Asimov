import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * @module tests/unit/controllers/MoyenneController.test
 * @description Tests unitaires en français pour le contrôleur MoyenneController.
 * On utilise vi.spyOn pour isoler la logique du contrôleur de celle du modèle.
 */

const MoyenneController = require("../../../controllers/MoyenneController");
const MoyenneModel = require("../../../models/MoyenneModel");

describe("MoyenneController", () => {
  let req, res, next;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Initialisation des objets Express
    req = {
      body: {},
      params: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();

    // Interception des appels au modèle pour éviter toute interaction avec la BDD
    vi.spyOn(MoyenneModel, "create").mockImplementation(async () => {});
    vi.spyOn(MoyenneModel, "findByInscription").mockImplementation(async () => []);
    vi.spyOn(MoyenneModel, "validate").mockImplementation(async () => 0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * @test {MoyenneController.createMoyenne}
   * @description Test de la création d'une moyenne via le contrôleur.
   */
  describe("createMoyenne", () => {
    it("devrait renvoyer un statut 201 et traiter la création avec succès", async () => {
      // Configuration de la requête
      req.body = {
        inscription_id: 1,
        semestre: 1,
        moyenne_generale: 15.5,
      };

      // Configuration du mock du modèle
      vi.spyOn(MoyenneModel, "create").mockResolvedValue(123);

      // Exécution
      await MoyenneController.createMoyenne(req, res, next);

      // Vérifications
      expect(MoyenneModel.create).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Moyenne enregistrée avec succès !",
          id: 123,
        })
      );
    });

    it("devrait passer l'erreur à 'next' si les données obligatoires sont incomplètes", async () => {
      // Simulation sans données obligatoires
      req.body = { inscription_id: 1 }; 

      await MoyenneController.createMoyenne(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 400 })
      );
    });
  });

  /**
   * @test {MoyenneController.getMoyennesByInscription}
   * @description Test de la récupération de la liste des moyennes.
   */
  describe("getMoyennesByInscription", () => {
    it("devrait renvoyer un statut 200 accompagné de la liste des moyennes mockées", async () => {
      req.params.inscription_id = "1";
      const listeMockee = [{ id: 1, moyenne_generale: 15.5 }];
      vi.spyOn(MoyenneModel, "findByInscription").mockResolvedValue(listeMockee);

      await MoyenneController.getMoyennesByInscription(req, res, next);

      expect(MoyenneModel.findByInscription).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(listeMockee);
    });
  });

  /**
   * @test {MoyenneController.validerMoyenne}
   * @description Test de validation du statut de la moyenne.
   */
  describe("validerMoyenne", () => {
    it("devrait renvoyer un statut 200 si la moyenne est bien validée", async () => {
      req.params.id = "1";
      // 1 ligne affectée = succès
      vi.spyOn(MoyenneModel, "validate").mockResolvedValue(1);

      await MoyenneController.validerMoyenne(req, res, next);

      expect(MoyenneModel.validate).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Moyenne validée avec succès !",
      });
    });

    it("devrait appeler 'next(404)' si la moyenne à valider n'est pas trouvée", async () => {
      req.params.id = "999";
      // 0 ligne affectée = introuvable
      vi.spyOn(MoyenneModel, "validate").mockResolvedValue(0);

      await MoyenneController.validerMoyenne(req, res, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: 404 })
      );
    });
  });
});

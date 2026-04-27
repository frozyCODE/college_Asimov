import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * @module tests/unit/controllers/StageController.test
 * @description Tests unitaires en français pour le contrôleur StageController.
 * Fichier généré automatiquement.
 */

const StageController = require("../../../controllers/StageController.js");

describe("StageController", () => {
  let req, res, next;

  beforeEach(() => {
    vi.clearAllMocks();
    req = { body: {}, params: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
    
    // TODO: Ajouter des vi.spyOn() pour les modèles que ce contrôleur utilise
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  /**
   * @test {StageController.addRecherche}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("addRecherche", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(StageController.addRecherche).toBeDefined();
      expect(typeof StageController.addRecherche).toBe("function");
    });
  });

  /**
   * @test {StageController.getAlertes}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("getAlertes", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(StageController.getAlertes).toBeDefined();
      expect(typeof StageController.getAlertes).toBe("function");
    });
  });
});

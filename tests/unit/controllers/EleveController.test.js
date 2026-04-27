import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * @module tests/unit/controllers/EleveController.test
 * @description Tests unitaires en français pour le contrôleur EleveController.
 * Fichier généré automatiquement.
 */

const EleveController = require("../../../controllers/EleveController.js");

describe("EleveController", () => {
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
   * @test {EleveController.getEleves}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("getEleves", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(EleveController.getEleves).toBeDefined();
      expect(typeof EleveController.getEleves).toBe("function");
    });
  });

  /**
   * @test {EleveController.addEleve}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("addEleve", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(EleveController.addEleve).toBeDefined();
      expect(typeof EleveController.addEleve).toBe("function");
    });
  });

  /**
   * @test {EleveController.updateEleve}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("updateEleve", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(EleveController.updateEleve).toBeDefined();
      expect(typeof EleveController.updateEleve).toBe("function");
    });
  });

  /**
   * @test {EleveController.deleteEleve}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("deleteEleve", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(EleveController.deleteEleve).toBeDefined();
      expect(typeof EleveController.deleteEleve).toBe("function");
    });
  });
});

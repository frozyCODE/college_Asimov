import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * @module tests/unit/controllers/ParentController.test
 * @description Tests unitaires en français pour le contrôleur ParentController.
 * Fichier généré automatiquement.
 */

const ParentController = require("../../../controllers/ParentController.js");

describe("ParentController", () => {
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
   * @test {ParentController.getParents}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("getParents", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(ParentController.getParents).toBeDefined();
      expect(typeof ParentController.getParents).toBe("function");
    });
  });

  /**
   * @test {ParentController.addParent}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("addParent", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(ParentController.addParent).toBeDefined();
      expect(typeof ParentController.addParent).toBe("function");
    });
  });

  /**
   * @test {ParentController.lierEleve}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("lierEleve", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(ParentController.lierEleve).toBeDefined();
      expect(typeof ParentController.lierEleve).toBe("function");
    });
  });

  /**
   * @test {ParentController.getMesEleves}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("getMesEleves", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(ParentController.getMesEleves).toBeDefined();
      expect(typeof ParentController.getMesEleves).toBe("function");
    });
  });
});

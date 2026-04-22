import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * @module tests/unit/controllers/ClasseController.test
 * @description Tests unitaires en français pour le contrôleur ClasseController.
 * Fichier généré automatiquement.
 */

const ClasseController = require("../../../controllers/ClasseController.js");

describe("ClasseController", () => {
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
   * @test {ClasseController.getClasses}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("getClasses", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(ClasseController.getClasses).toBeDefined();
      expect(typeof ClasseController.getClasses).toBe("function");
    });
  });

  /**
   * @test {ClasseController.createClasse}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("createClasse", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(ClasseController.createClasse).toBeDefined();
      expect(typeof ClasseController.createClasse).toBe("function");
    });
  });

  /**
   * @test {ClasseController.deleteClasse}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("deleteClasse", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(ClasseController.deleteClasse).toBeDefined();
      expect(typeof ClasseController.deleteClasse).toBe("function");
    });
  });
});

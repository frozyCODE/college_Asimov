import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * @module tests/unit/controllers/authController.test
 * @description Tests unitaires en français pour le contrôleur authController.
 * Fichier généré automatiquement.
 */

const authController = require("../../../controllers/authController.js");

describe("authController", () => {
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
   * @test {authController.login}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("login", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(authController.login).toBeDefined();
      expect(typeof authController.login).toBe("function");
    });
  });
});

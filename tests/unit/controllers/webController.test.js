import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * @module tests/unit/controllers/webController.test
 * @description Tests unitaires en français pour le contrôleur webController.
 * Fichier généré automatiquement.
 */

const webController = require("../../../controllers/webController.js");

describe("webController", () => {
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
   * @test {webController.requireSession}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("requireSession", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(webController.requireSession).toBeDefined();
      expect(typeof webController.requireSession).toBe("function");
    });
  });

  /**
   * @test {webController.getLogin}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("getLogin", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(webController.getLogin).toBeDefined();
      expect(typeof webController.getLogin).toBe("function");
    });
  });

  /**
   * @test {webController.postLogin}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("postLogin", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(webController.postLogin).toBeDefined();
      expect(typeof webController.postLogin).toBe("function");
    });
  });

  /**
   * @test {webController.logout}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("logout", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(webController.logout).toBeDefined();
      expect(typeof webController.logout).toBe("function");
    });
  });

  /**
   * @test {webController.getDashboard}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("getDashboard", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(webController.getDashboard).toBeDefined();
      expect(typeof webController.getDashboard).toBe("function");
    });
  });

  /**
   * @test {webController.getEleves}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("getEleves", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(webController.getEleves).toBeDefined();
      expect(typeof webController.getEleves).toBe("function");
    });
  });

  /**
   * @test {webController.getMoyennes}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("getMoyennes", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(webController.getMoyennes).toBeDefined();
      expect(typeof webController.getMoyennes).toBe("function");
    });
  });

  /**
   * @test {webController.getOptions}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("getOptions", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(webController.getOptions).toBeDefined();
      expect(typeof webController.getOptions).toBe("function");
    });
  });

  /**
   * @test {webController.getInscriptions}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("getInscriptions", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(webController.getInscriptions).toBeDefined();
      expect(typeof webController.getInscriptions).toBe("function");
    });
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * @module tests/unit/controllers/OptionController.test
 * @description Tests unitaires en français pour le contrôleur OptionController.
 * Fichier généré automatiquement.
 */

const OptionController = require("../../../controllers/OptionController.js");

describe("OptionController", () => {
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
   * @test {OptionController.getOptions}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("getOptions", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(OptionController.getOptions).toBeDefined();
      expect(typeof OptionController.getOptions).toBe("function");
    });
  });

  /**
   * @test {OptionController.addOption}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("addOption", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(OptionController.addOption).toBeDefined();
      expect(typeof OptionController.addOption).toBe("function");
    });
  });

  /**
   * @test {OptionController.choisirOption}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("choisirOption", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(OptionController.choisirOption).toBeDefined();
      expect(typeof OptionController.choisirOption).toBe("function");
    });
  });

  /**
   * @test {OptionController.desisterOption}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("desisterOption", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(OptionController.desisterOption).toBeDefined();
      expect(typeof OptionController.desisterOption).toBe("function");
    });
  });

  /**
   * @test {OptionController.getOptionsByEleve}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("getOptionsByEleve", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(OptionController.getOptionsByEleve).toBeDefined();
      expect(typeof OptionController.getOptionsByEleve).toBe("function");
    });
  });

  /**
   * @test {OptionController.getElevesByOption}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("getElevesByOption", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(OptionController.getElevesByOption).toBeDefined();
      expect(typeof OptionController.getElevesByOption).toBe("function");
    });
  });

  /**
   * @test {OptionController.deleteOption}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("deleteOption", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(OptionController.deleteOption).toBeDefined();
      expect(typeof OptionController.deleteOption).toBe("function");
    });
  });
});

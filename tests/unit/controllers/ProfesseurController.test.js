import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * @module tests/unit/controllers/ProfesseurController.test
 * @description Tests unitaires en français pour le contrôleur ProfesseurController.
 * Fichier généré automatiquement.
 */

const ProfesseurController = require("../../../controllers/ProfesseurController.js");

describe("ProfesseurController", () => {
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
   * @test {ProfesseurController.getProfesseurs}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("getProfesseurs", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(ProfesseurController.getProfesseurs).toBeDefined();
      expect(typeof ProfesseurController.getProfesseurs).toBe("function");
    });
  });

  /**
   * @test {ProfesseurController.addProfesseur}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("addProfesseur", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(ProfesseurController.addProfesseur).toBeDefined();
      expect(typeof ProfesseurController.addProfesseur).toBe("function");
    });
  });

  /**
   * @test {ProfesseurController.updateProfesseur}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("updateProfesseur", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(ProfesseurController.updateProfesseur).toBeDefined();
      expect(typeof ProfesseurController.updateProfesseur).toBe("function");
    });
  });

  /**
   * @test {ProfesseurController.deleteProfesseur}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("deleteProfesseur", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(ProfesseurController.deleteProfesseur).toBeDefined();
      expect(typeof ProfesseurController.deleteProfesseur).toBe("function");
    });
  });
});

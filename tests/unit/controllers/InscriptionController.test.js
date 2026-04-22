import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * @module tests/unit/controllers/InscriptionController.test
 * @description Tests unitaires en français pour le contrôleur InscriptionController.
 * Fichier généré automatiquement.
 */

const InscriptionController = require("../../../controllers/InscriptionController.js");

describe("InscriptionController", () => {
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
   * @test {InscriptionController.createInscription}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("createInscription", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(InscriptionController.createInscription).toBeDefined();
      expect(typeof InscriptionController.createInscription).toBe("function");
    });
  });

  /**
   * @test {InscriptionController.getInscriptionsByEleve}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("getInscriptionsByEleve", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(InscriptionController.getInscriptionsByEleve).toBeDefined();
      expect(typeof InscriptionController.getInscriptionsByEleve).toBe("function");
    });
  });

  /**
   * @test {InscriptionController.getInscriptionsByClasse}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("getInscriptionsByClasse", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(InscriptionController.getInscriptionsByClasse).toBeDefined();
      expect(typeof InscriptionController.getInscriptionsByClasse).toBe("function");
    });
  });

  /**
   * @test {InscriptionController.deleteInscription}
   * @description Test de base de la fonction du contrôleur.
   */
  describe("deleteInscription", () => {
    it("devrait vérifier la présence de la méthode", async () => {
      expect(InscriptionController.deleteInscription).toBeDefined();
      expect(typeof InscriptionController.deleteInscription).toBe("function");
    });
  });
});

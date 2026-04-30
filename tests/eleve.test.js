/**
 * @module tests/eleve.test
 * @description Suite de tests unitaires pour le contrôleur et les routes des élèves.
 */

const request = require('supertest');
const app = require('../server'); 
const db = require('../config/db'); 
const jwt = require('jsonwebtoken');

// On mock la DB pour éviter de taper dans le vrai MySQL
jest.mock('../config/db', () => ({
  execute: jest.fn(),
  query: jest.fn()
}));

// On défini un JWT_SECRET fictif pour que jwt.sign puisse générer un token
process.env.JWT_SECRET = 'secret_de_test';

describe('Eleve Routes - Tests Unitaires Simples', () => {

  // Fonction utilitaire pour générer des tokens de test à la volée
  const generateTestToken = (role) => {
    return jwt.sign({ id: 99, role: role, email: 'test@college.fr' }, process.env.JWT_SECRET, { expiresIn: '1h' });
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/eleves', () => {

    /**
     * Cas 1: Sécurité absolue (Pas de Token)
     */
    it('1. Devrait refuser l\'accès (401) si aucun token n\'est fourni', async () => {
      const response = await request(app)
        .get('/api/eleves');

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/Token manquant/i);
    });

    /**
     * Cas 2: Autorisation par Rôle (Access Control)
     */
    it('2. Devrait refuser l\'accès (403) si le rôle est "Eleve" (Non autorisé à voir la liste)', async () => {
      const tokenEleve = generateTestToken('Eleve');

      const response = await request(app)
        .get('/api/eleves')
        .set('Authorization', `Bearer ${tokenEleve}`);

      expect(response.status).toBe(403);
      expect(response.body.message).toMatch(/Accès interdit/i);
    });

    /**
     * Cas 3: Scénario Nominal (Accès autorisé)
     */
    it('3. Devrait retourner (200) avec la liste des élèves pour un "Professeur"', async () => {
      const tokenProf = generateTestToken('Professeur');

      // Simulation de la réponse MySQL : [rows] où rows est un tableau d'élèves
      const mockResultatBDD = [
        { id: 1, nom: Dupont', prenom: 'Jean', identifiant_csv: 'ELEV001' }
      ];
      db.execute.mockResolvedValue([mockResultatBDD]);

      const response = await request(app)
        .get('/api/eleves')
        .set('Authorization', `Bearer ${tokenProf}`);

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe:1);
      expect(response.body[0].nom).toBe('Dupont');
    });

  });
});

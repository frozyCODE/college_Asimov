/**
 * @module tests/auth.test
 * @description Suite de tests unitaires (simples) pour le contrôleur et les routes d'authentification.
 */

const request = require('supertest');
const app = require('../server'); 
const db = require('../config/db'); 
const bcrypt = require('bcrypt');

/**
 * 1) Mock de la base de données : On simule l'objet Pool de mysql2.
 * Ainsi, db.execute ne va jamais chercher un vrai serveur MySQL.
 */
jest.mock('../config/db', () => ({
  execute: jest.fn(),
  query: jest.fn()
}));

/**
 * 2) Mock de Bcrypt : On simule la fonction de comparaison des mots de passe.
 * Permet de forcer un résultat de vérification de mot de passe (Vrai ou Faux).
 */
jest.mock('bcrypt', () => ({
  compare: jest.fn()
}));

describe('Auth Routes - Tests Unitaires Simples', () => {
  beforeEach(() => {
    // Nettoie l'historique des appels (mocks) avant chaque test
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {

    /**
     * Cas 1: Échec de validation (Données manquantes)
     */
    it('1. Devrait retourner une erreur 422 si les données sont invalides', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ password: 'pas-d-email' }); // Email volontairement omis
      
      expect(response.status).toBe(422);
      expect(response.body.success).toBe(false);
    });

    /**
     * Cas 2: Utilisateur introuvable
     */
    it('2. Devrait retourner 401 si l\'utilisateur n\'existe pas en DB', async () => {
      // db.execute retourne un tableau vide dans la ligne de résultat
      db.execute.mockResolvedValue([[]]); 

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'faux@test.fr', password: 'password123' });

      expect(response.status).toBe(401);
      expect(response.body.message).toMatch(/incorrect/i); 
    });

    /**
     * Cas 3: Connexion réussie
     */
    it('3. Devrait retourner 200 et un Token si tout est bon', async () => {
      // Simuler l'utilisateur renvoyé par la base de données
      const fauxUtilisateurEnBDD = {
        id: 1,
        nom: 'Dupont',
        prenom: 'Jean',
        email: 'jean@test.fr',
        password_hash: 'hash_simule',
        role: 'Eleve'
      };
      
      // On retourne cet utilisateur quand db.execute("SELECT ... ") est appelé
      db.execute.mockResolvedValue([[fauxUtilisateurEnBDD]]); 
      
      // On simule que Bcrypt valide le mot de passe !
      bcrypt.compare.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: 'jean@test.fr', password: 'bon_mot_de_passe' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token'); // Vérifie la présence du JWT
    });

  });
});

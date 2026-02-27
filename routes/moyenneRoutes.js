const express = require('express');
const router = express.Router();
const moyenneController = require('../controllers/MoyenneController');

// Routes pour les moyennes
router.post('/', moyenneController.createMoyenne); // Créer une moyenne
router.get('/inscription/:inscription_id', moyenneController.getMoyennesByInscription); // Voir les moyennes d'une inscription
router.patch('/:id/valider', moyenneController.validerMoyenne); // Valider la moyenne (Proviseur)

module.exports = router;

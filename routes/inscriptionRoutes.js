const express = require('express');
const router = express.Router();
const inscriptionController = require('../controllers/InscriptionController');

// Routes pour les inscriptions
router.post('/', inscriptionController.createInscription);
router.get('/eleve/:eleve_id', inscriptionController.getInscriptionsByEleve);
router.get('/classe', inscriptionController.getInscriptionsByClasse);
router.delete('/:id', inscriptionController.deleteInscription);

module.exports = router;

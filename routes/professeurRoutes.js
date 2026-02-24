const express = require('express');
const router = express.Router();
const professeurController = require('../controllers/ProfesseurController');

router.get('/', professeurController.getProfesseurs);
router.post('/', professeurController.addProfesseur);
router.put('/:id', professeurController.updateProfesseur);
router.delete('/:id', professeurController.deleteProfesseur);

module.exports = router;
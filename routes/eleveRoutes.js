const express = require('express');
const router = express.Router(); 
const eleveController = require('../controllers/EleveController');

router.get('/', eleveController.getEleves);
router.post('/', eleveController.addEleve);
router.put('/:id', eleveController.updateEleve);
router.delete('/:id', eleveController.deleteEleve);

module.exports = router;
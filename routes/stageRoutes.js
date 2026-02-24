const express = require('express');
const router = express.Router();
const stageController = require('../controllers/StageController');

router.post('/recherches', stageController.addRecherche);
router.get('/alertes', stageController.getAlertes);

module.exports = router;
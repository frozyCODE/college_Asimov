const express = require('express');
const router = express.Router(); 
const eleveController = require('../controllers/EleveController');


// GET : Récupérer tous les élèves
// URL finale : GET http://localhost:3000/api/eleves/
router.get('/', eleveController.getEleves);

// POST : Ajouter un nouvel élève
// URL finale : POST http://localhost:3000/api/eleves/
router.post('/', eleveController.addEleve);

// PUT : Mettre à jour un élève précis
// URL finale : PUT http://localhost:3000/api/eleves/5
router.put('/:id', eleveController.updateEleve);

// DELETE : Supprimer un élève précis
// URL finale : DELETE http://localhost:3000/api/eleves/5
router.delete('/:id', eleveController.deleteEleve);

module.exports = router;
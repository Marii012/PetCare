const express = require('express');
const router = express.Router();

const vaccineController = require('../controllers/vaccinesController');


// LISTAR TODAS AS VACINAS
router.get('/', vaccineController.getAllVaccines);


// LISTAR VACINAS POR PET
router.get('/pet/:id', vaccineController.getVaccinesByPet);


// OBTER VACINA POR ID
router.get('/:id', vaccineController.getVaccineById);


// CRIAR VACINA
router.post('/', vaccineController.createVaccine);


// ATUALIZAR VACINA
router.put('/:id', vaccineController.updateVaccine);


// ELIMINAR VACINA
router.delete('/:id', vaccineController.deleteVaccine);


module.exports = router;
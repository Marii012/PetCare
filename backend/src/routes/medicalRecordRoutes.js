const express = require('express');
const router = express.Router();

const medicalRecordController = require('../controllers/medicalRecordController');


// LISTAR TODOS
router.get('/', medicalRecordController.getAllMedicalRecords);


// LISTAR POR PET
router.get('/pet/:id', medicalRecordController.getMedicalRecordsByPet);


// OBTER POR ID
router.get('/:id', medicalRecordController.getMedicalRecordById);


// CRIAR
router.post('/', medicalRecordController.createMedicalRecord);


// ATUALIZAR
router.put('/:id', medicalRecordController.updateMedicalRecord);


// ELIMINAR
router.delete('/:id', medicalRecordController.deleteMedicalRecord);


module.exports = router;
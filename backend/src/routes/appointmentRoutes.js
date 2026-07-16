const express = require('express');
const router = express.Router();

const appointmentController = require('../controllers/appointmentController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

// LISTAR TODAS
router.get('/', appointmentController.getAllAppointments);


// LISTAR POR PET
router.get('/pet/:id', appointmentController.getAppointmentsByPet);


// OBTER POR ID
router.get('/:id', appointmentController.getAppointmentById);


// CRIAR
router.post('/', appointmentController.createAppointment);


// ATUALIZAR
router.put('/:id', appointmentController.updateAppointment);


// ELIMINAR
router.delete('/:id', appointmentController.deleteAppointment);


module.exports = router;
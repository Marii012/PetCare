const express = require('express');

const router = express.Router();

const serviceController = require('../controllers/serviceController');



// LISTAR SERVIÇOS
router.get(
  '/',
  serviceController.getAllServices
);



// OBTER SERVIÇO POR ID
router.get(
  '/:id',
  serviceController.getServiceById
);



// CRIAR SERVIÇO
router.post(
  '/',
  serviceController.createService
);



// ATUALIZAR SERVIÇO
router.put(
  '/:id',
  serviceController.updateService
);



// ELIMINAR SERVIÇO
router.delete(
  '/:id',
  serviceController.deleteService
);



module.exports = router;
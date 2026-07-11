const express = require('express');

const router = express.Router();

const roleController = require('../controllers/roleController');



// LISTAR ROLES
router.get(
  '/',
  roleController.getAllRoles
);



// OBTER ROLE POR ID
router.get(
  '/:id',
  roleController.getRoleById
);



// CRIAR ROLE
router.post(
  '/',
  roleController.createRole
);



// ATUALIZAR ROLE
router.put(
  '/:id',
  roleController.updateRole
);



// ELIMINAR ROLE
router.delete(
  '/:id',
  roleController.deleteRole
);



module.exports = router;
const express = require('express');
const router = express.Router();

const petController = require('../controllers/petController');


// LISTAR TODOS OS PETS
router.get('/', petController.getAllPets);


// OBTER PET POR ID
router.get('/:id', petController.getPetById);


// LISTAR PETS POR UTILIZADOR
router.get('/user/:id', petController.getPetsByUser);


// CRIAR PET
router.post('/', petController.createPet);


// ATUALIZAR PET
router.put('/:id', petController.updatePet);


// ELIMINAR PET
router.delete('/:id', petController.deletePet);


module.exports = router;
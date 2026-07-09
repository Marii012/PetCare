const express = require('express');
const router = express.Router();

const breedController = require('../controllers/breedController');


router.get('/', breedController.getAllBreeds);

router.get('/species/:id', breedController.getBreedsBySpecies);

router.get('/:id', breedController.getBreedById);

router.post('/', breedController.createBreed);

router.put('/:id', breedController.updateBreed);

router.delete('/:id', breedController.deleteBreed);


module.exports = router;
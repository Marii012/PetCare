const Species = require('./speciesModel');
const Breed = require('./breedModel');
const Pet = require('./petModel');
const User = require('./userModel');

Species.hasMany(Breed, {
  foreignKey: 'id_species'
});

Breed.belongsTo(Species, {
  foreignKey: 'id_species'
});

Pet.belongsTo(User, {
  foreignKey: 'id_user'
});

Pet.belongsTo(Species, {
  foreignKey: 'id_species'
});

Pet.belongsTo(Breed, {
  foreignKey: 'id_breed'
});

module.exports = {
  Species,
  Breed,
  Pet,
  User
};
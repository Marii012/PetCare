const Species = require('./speciesModel');
const Breed = require('./breedModel');

Species.hasMany(Breed, {
  foreignKey: 'id_species'
});

Breed.belongsTo(Species, {
  foreignKey: 'id_species'
});

module.exports = {
  Species,
  Breed
};
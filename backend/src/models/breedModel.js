const { DataTypes } = require('sequelize');
const sequelize = require('../database/database-remote');

const Breed = sequelize.define('Breed', {
  id_breed: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_breed'
  },

  nome_raca: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nome_raca'
  },

  id_species: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_species'
  }

}, {
  tableName: 'BREED',
  timestamps: false
});

module.exports = Breed;
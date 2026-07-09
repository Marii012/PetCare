const { DataTypes } = require('sequelize');
const sequelize = require('../database/database-remote');

const Species = sequelize.define('Species', {
  id_species: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_species'
  },

  nome_especie: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nome_especie'
  }

}, {
  tableName: 'SPECIES',
  timestamps: false
});

module.exports = Species;
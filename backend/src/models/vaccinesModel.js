const { DataTypes } = require('sequelize');
const sequelize = require('../database/database-remote');

const Vaccine = sequelize.define('Vaccine', {

  id_vaccine: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_vaccine'
  },

  nome_vacina: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nome_vacina'
  },

  data_administracao: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'data_administracao'
  },

  proxima_dose: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'proxima_dose'
  },

  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'observacoes'
  },

  id_pet: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_pet'
  },

  id_veterinario: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_veterinario'
  },

  fabricante: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'fabricante'
  },

  lote_vacina: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'lote_vacina'
  }

}, {
  tableName: 'PET_VACCINE',
  timestamps: false
});


module.exports = Vaccine;
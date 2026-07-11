const { DataTypes } = require('sequelize');
const sequelize = require('../database/database-remote');

const Pet = sequelize.define('Pet', {
  id_pet: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_pet'
  },

  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nome'
  },

  sexo: {
    type: DataTypes.CHAR(1),
    allowNull: true,
    field: 'sexo'
  },

  data_nascimento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
    field: 'data_nascimento'
  },

  peso: {
    type: DataTypes.DECIMAL,
    allowNull: true,
    field: 'peso'
  },

  num_chip: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'num_chip'
  },

  fotografia: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'fotografia'
  },

  id_species: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_species'
  },

  id_breed: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_breed'
  },

  id_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_user'
  },

  cor: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'cor'
  },

  esterilizado: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false,
    field: 'esterilizado'
  },

  alergias: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'alergias'
  },

  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'observacoes'
  },

  porte: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'porte'
  },

  estado: {
    type: DataTypes.STRING(50),
    allowNull: true,
    defaultValue: 'Ativo',
    field: 'estado'
  }

}, {
  tableName: 'PET',
  timestamps: false
});

module.exports = Pet;
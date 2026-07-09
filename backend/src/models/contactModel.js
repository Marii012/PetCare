const { DataTypes } = require('sequelize');
const sequelize = require('../database/database-remote');

const Contact = sequelize.define('Contact', {

  id_contact: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_contact'
  },

  nome_tutor: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'nome_tutor'
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'email'
  },

  telefone: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'telefone'
  },

  indicativo_pais: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'indicativo_pais'
  },

  nome_animal: {
    type: DataTypes.STRING,
    allowNull: true,
    field: 'nome_animal'
  },

  mensagem: {
    type: DataTypes.TEXT,
    allowNull: false,
    field: 'mensagem'
  },

  estado: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'Pendente',
    field: 'estado'
  },

  notas: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'notas'
  },

  data_envio: {
    type: DataTypes.DATE,
    field: 'data_envio'
  },

  data_resposta: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'data_resposta'
  },

  id_species: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_species'
  },

  id_breed: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_breed'
  },

  id_contact_reason: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_contact_reason'
  },

  id_user: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_user'
  }

}, {
  tableName: 'CONTACT',
  timestamps: false
});

module.exports = Contact;
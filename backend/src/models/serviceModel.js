const { DataTypes } = require('sequelize');
const sequelize = require('../database/database-remote');

const Service = sequelize.define('Service', {

  id_service: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_service'
  },

  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nome'
  },

  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descricao'
  },

  preco: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    field: 'preco'
  },

  duracao: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'duracao'
  },

  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: true,
    field: 'ativo'
  }

}, {
  tableName: 'SERVICE',
  timestamps: false
});


module.exports = Service;
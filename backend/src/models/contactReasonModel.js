const { DataTypes } = require('sequelize');
const sequelize = require('../database/database-remote');

const ContactReason = sequelize.define('ContactReason', {

  id_contact_reason: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_contact_reason'
  },

  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    field: 'nome'
  },

  ativo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
    field: 'ativo'
  }

}, {
  tableName: 'CONTACT_REASON',
  timestamps: false
});

module.exports = ContactReason;
const { DataTypes } = require('sequelize');
const sequelize = require('../database/database-remote');

const Role = sequelize.define('Role', {

  id_role: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_role'
  },

  nome_role: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nome_role'
  }

}, {
  tableName: 'ROLE',
  timestamps: false
});


module.exports = Role;
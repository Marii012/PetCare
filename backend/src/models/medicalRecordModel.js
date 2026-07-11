const { DataTypes } = require('sequelize');
const sequelize = require('../database/database-remote');

const MedicalRecord = sequelize.define('MedicalRecord', {

  id_record: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_record'
  },

  diagnostico: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'diagnostico'
  },

  sintomas: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'sintomas'
  },

  tratamento_receitado: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'tratamento_receitado'
  },

  data_registo: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'data_registo'
  },

  id_pet: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_pet'
  },

  id_veterinario: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_veterinario'
  },

  id_appointment: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'id_appointment'
  },

  peso: {
    type: DataTypes.DECIMAL,
    allowNull: true,
    field: 'peso'
  },

  temperatura: {
    type: DataTypes.DECIMAL,
    allowNull: true,
    field: 'temperatura'
  },

  frequencia_cardiaca: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'frequencia_cardiaca'
  },

  recomendacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'recomendacoes'
  }

}, {
  tableName: 'MEDICAL_RECORD',
  timestamps: false
});


module.exports = MedicalRecord;
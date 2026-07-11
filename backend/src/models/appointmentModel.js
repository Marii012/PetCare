const { DataTypes } = require('sequelize');
const sequelize = require('../database/database-remote');

const Appointment = sequelize.define('Appointment', {

  id_appointment: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_appointment'
  },

  data: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'data'
  },

  hora: {
    type: DataTypes.TIME,
    allowNull: false,
    field: 'hora'
  },

  motivo: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'motivo'
  },

  estado: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: 'Pendente',
    field: 'estado'
  },

  observacoes: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'observacoes'
  },

  data_marcacao: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'data_marcacao'
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

  id_service: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'id_service'
  },

  preco_final: {
    type: DataTypes.DECIMAL,
    allowNull: true,
    field: 'preco_final'
  },

  motivo_cancelamento: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'motivo_cancelamento'
  },

  data_confirmacao: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'data_confirmacao'
  },

  duracao_real: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'duracao_real'
  }

}, {
  tableName: 'APPOINTMENT',
  timestamps: false
});


module.exports = Appointment;
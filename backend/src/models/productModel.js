const { DataTypes } = require('sequelize');
const sequelize = require('../database/database-remote');

const Product = sequelize.define('Product', {

  id_product: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'id_product'
  },

  nome: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'nome'
  },

  codigo_barras: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'codigo_barras'
  },

  preco_venda: {
    type: DataTypes.DECIMAL,
    allowNull: false,
    field: 'preco_venda'
  },

  stock_atual: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: 'stock_atual'
  },

  stock_minimo: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
    field: 'stock_minimo'
  },

  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'descricao'
  },

  fornecedor: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'fornecedor'
  },

  imagem: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'imagem'
  },

  categoria: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'categoria'
  }

}, {
  tableName: 'PRODUCT',
  timestamps: false
});


module.exports = Product;
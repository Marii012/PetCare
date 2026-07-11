const Invoice = require('../models/invoiceModel');
const User = require('../models/userModel');

const invoiceController = {

  // LISTAR FATURAS
  getAllInvoices: async (req, res) => {
    try {
      const { status } = req.query;
      const where = {};

      if (status && status !== 'all') {
        where.estado_pagamento = status;
      }

      const invoices = await Invoice.findAll({
        where,
        order: [['data_emissao', 'DESC']]
      });

      return res.status(200).json(invoices);

    } catch (error) {

      console.error('Erro ao listar faturas:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível listar as faturas.'
      });

    }
  },

  // OBTER FATURA
  getInvoiceById: async (req, res) => {
    try {

      const { id } = req.params;

      const invoice = await Invoice.findByPk(id);

      if (!invoice) {
        return res.status(404).json({
          error: 'Fatura não encontrada.',
          message: 'A fatura indicada não existe.'
        });
      }

      return res.status(200).json(invoice);

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível obter a fatura.'
      });

    }
  },

  // CRIAR FATURA
  createInvoice: async (req, res) => {
    try {

      const {
        num_fatura,
        total_bruto,
        total_impostos,
        total_liquido,
        estado_pagamento,
        id_user
      } = req.body;

      if (!num_fatura || !id_user) {
        return res.status(400).json({
          error: 'Dados inválidos.',
          message: 'Número da fatura e utilizador são obrigatórios.'
        });
      }

      const user = await User.findByPk(id_user);

      if (!user) {
        return res.status(404).json({
          error: 'Utilizador não encontrado.',
          message: 'O utilizador indicado não existe.'
        });
      }

      const invoice = await Invoice.create({
        num_fatura,
        total_bruto,
        total_impostos,
        total_liquido,
        estado_pagamento,
        id_user
      });

      return res.status(201).json({
        message: 'Fatura criada com sucesso!',
        invoice
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível criar a fatura.'
      });

    }
  },

  // ATUALIZAR FATURA
  updateInvoice: async (req, res) => {
    try {

      const { id } = req.params;

      const invoice = await Invoice.findByPk(id);

      if (!invoice) {
        return res.status(404).json({
          error: 'Fatura não encontrada.',
          message: 'A fatura indicada não existe.'
        });
      }

      await invoice.update(req.body);

      return res.status(200).json({
        message: 'Fatura atualizada com sucesso!',
        invoice
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível atualizar a fatura.'
      });

    }
  },

  // ELIMINAR FATURA
  deleteInvoice: async (req, res) => {
    try {

      const { id } = req.params;

      const invoice = await Invoice.findByPk(id);

      if (!invoice) {
        return res.status(404).json({
          error: 'Fatura não encontrada.',
          message: 'A fatura indicada não existe.'
        });
      }

      await invoice.destroy();

      return res.status(200).json({
        message: 'Fatura eliminada com sucesso.'
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível eliminar a fatura.'
      });

    }
  }

};

module.exports = invoiceController;
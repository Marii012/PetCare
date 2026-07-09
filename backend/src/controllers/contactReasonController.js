const sequelize = require('../database/database-remote');
const ContactReason = require('../models/contactReasonModel');

const contactReasonController = {

  // LISTAR TODOS OS MOTIVOS
  getAllContactReasons: async (req, res) => {
    try {

      const reasons = await ContactReason.findAll({
        where: { ativo: true },
        order: [
          [
            sequelize.literal(`
              CASE
                WHEN nome = 'Outro' THEN 1
                ELSE 0
              END
            `),
            'ASC'
          ],
          ['nome', 'ASC']
        ]
      });

      return res.status(200).json(reasons);

    } catch (error) {

      console.error('Erro ao listar motivos de contacto:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível carregar os motivos de contacto.'
      });

    }
  },

  // OBTER MOTIVO POR ID
  getContactReasonById: async (req, res) => {
    try {

      const { id } = req.params;

      const reason = await ContactReason.findByPk(id);

      if (!reason) {
        return res.status(404).json({
          error: 'Motivo não encontrado.',
          message: 'O motivo de contacto indicado não existe.'
        });
      }

      return res.status(200).json(reason);

    } catch (error) {

      console.error('Erro ao procurar motivo:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível obter o motivo de contacto.'
      });

    }
  },

  // CRIAR MOTIVO
  createContactReason: async (req, res) => {
    try {

      const { nome } = req.body;

      if (!nome) {
        return res.status(400).json({
          error: 'Dados inválidos.',
          message: 'O nome é obrigatório.'
        });
      }

      const exists = await ContactReason.findOne({
        where: { nome }
      });

      if (exists) {
        return res.status(400).json({
          error: 'Motivo existente.',
          message: 'Já existe um motivo com esse nome.'
        });
      }

      const reason = await ContactReason.create({
        nome
      });

      return res.status(201).json({
        message: 'Motivo criado com sucesso!',
        reason
      });

    } catch (error) {

      console.error('Erro ao criar motivo:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível criar o motivo.'
      });

    }
  },

  // ATUALIZAR MOTIVO
  updateContactReason: async (req, res) => {
    try {

      const { id } = req.params;
      const { nome, ativo } = req.body;

      const reason = await ContactReason.findByPk(id);

      if (!reason) {
        return res.status(404).json({
          error: 'Motivo não encontrado.',
          message: 'O motivo indicado não existe.'
        });
      }

      if (nome) reason.nome = nome;

      if (ativo !== undefined) {
        reason.ativo = ativo;
      }

      await reason.save();

      return res.status(200).json({
        message: 'Motivo atualizado com sucesso!',
        reason
      });

    } catch (error) {

      console.error('Erro ao atualizar motivo:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível atualizar o motivo.'
      });

    }
  },

  // ELIMINAR MOTIVO
  deleteContactReason: async (req, res) => {
    try {

      const { id } = req.params;

      const reason = await ContactReason.findByPk(id);

      if (!reason) {
        return res.status(404).json({
          error: 'Motivo não encontrado.',
          message: 'O motivo indicado não existe.'
        });
      }

      await reason.destroy();

      return res.status(200).json({
        message: 'Motivo eliminado com sucesso.'
      });

    } catch (error) {

      console.error('Erro ao eliminar motivo:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível eliminar o motivo.'
      });

    }
  }

};

module.exports = contactReasonController;
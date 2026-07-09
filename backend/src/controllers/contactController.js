const Contact = require('../models/contactModel');

const contactController = {

  // LISTAR TODOS
  getAllContacts: async (req, res) => {
    try {

      const contacts = await Contact.findAll({
        order: [['data_envio', 'DESC']]
      });

      return res.status(200).json(contacts);

    } catch (error) {

      console.error('Erro ao listar contactos:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível carregar os contactos.'
      });

    }
  },

  // OBTER POR ID
  getContactById: async (req, res) => {

    try {

      const { id } = req.params;

      const contact = await Contact.findByPk(id);

      if (!contact) {
        return res.status(404).json({
          error: 'Contacto não encontrado.',
          message: 'O contacto indicado não existe.'
        });
      }

      return res.status(200).json(contact);

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível obter o contacto.'
      });

    }

  },

  // CRIAR
  createContact: async (req, res) => {

    try {

      const {
        nome_tutor,
        email,
        telefone,
        indicativo_pais,
        nome_animal,
        mensagem,
        id_species,
        id_breed,
        id_contact_reason,
        id_user
      } = req.body;

      if (!nome_tutor || !email || !telefone || !indicativo_pais || !mensagem) {
        return res.status(400).json({
          error: 'Dados inválidos.',
          message: 'Preencha todos os campos obrigatórios.'
        });
      }

      const contact = await Contact.create({

        nome_tutor,
        email,
        telefone,
        indicativo_pais,
        nome_animal,
        mensagem,
        id_species,
        id_breed,
        id_contact_reason,
        id_user

      });

      return res.status(201).json({

        message: 'Contacto enviado com sucesso!',
        contact

      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível enviar o contacto.'
      });

    }

  },

  // ALTERAR ESTADO
  updateContact: async (req, res) => {

    try {

      const { id } = req.params;
      const { estado, notas } = req.body;

      const contact = await Contact.findByPk(id);

      if (!contact) {

        return res.status(404).json({
          error: 'Contacto não encontrado.'
        });

      }

      if (estado)
        contact.estado = estado;

      if (notas)
        contact.notas = notas;

      if (estado === 'Respondido')
        contact.data_resposta = new Date();

      await contact.save();

      return res.status(200).json({

        message: 'Contacto atualizado com sucesso!',
        contact

      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({

        error: 'Erro no servidor.',
        message: 'Não foi possível atualizar o contacto.'

      });

    }

  },

  // ELIMINAR
  deleteContact: async (req, res) => {

    try {

      const { id } = req.params;

      const contact = await Contact.findByPk(id);

      if (!contact) {

        return res.status(404).json({
          error: 'Contacto não encontrado.'
        });

      }

      await contact.destroy();

      return res.status(200).json({
        message: 'Contacto eliminado com sucesso.'
      });

    } catch (error) {

      console.error(error);

      return res.status(500).json({

        error: 'Erro no servidor.',
        message: 'Não foi possível eliminar o contacto.'

      });

    }

  }

};

module.exports = contactController;
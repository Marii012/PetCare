const Appointment = require('../models/appointmentModel');
const Pet = require('../models/petModel');
const User = require('../models/userModel');
const Service = require('../models/serviceModel');

const allowedAppointmentStatuses = ['Pendente', 'Confirmada', 'Concluída', 'Cancelada'];

const isClientUser = (user) => Number(user?.id_role) === 1;

const normalizeAppointmentStatus = (status) => {
  if (!status) {
    return 'Pendente';
  }

  const normalizedStatus = String(status).trim();

  if (normalizedStatus === 'Rejeitada') {
    return 'Cancelada';
  }

  return allowedAppointmentStatuses.includes(normalizedStatus)
    ? normalizedStatus
    : 'Pendente';
};

const appointmentController = {


  // LISTAR TODAS AS CONSULTAS
  getAllAppointments: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          error: 'Token não fornecido.'
        });
      }

      const where = {};

      if (isClientUser(req.user)) {
        const userPets = await Pet.findAll({
          where: { id_user: req.user.id_user },
          attributes: ['id_pet']
        });

        const petIds = userPets.map((pet) => pet.id_pet);

        if (petIds.length === 0) {
          return res.status(200).json([]);
        }

        where.id_pet = petIds;
      }

      const appointments = await Appointment.findAll({
        where,
        order: [
          ['data', 'ASC'],
          ['hora', 'ASC']
        ]
      });

      return res.status(200).json(appointments);

    } catch (error) {

      console.error('Erro ao listar consultas:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível carregar as consultas.'
      });

    }
  },


  // OBTER CONSULTA POR ID
  getAppointmentById: async (req, res) => {
    try {

      const { id } = req.params;

      const appointment = await Appointment.findByPk(id);


      if (!appointment) {
        return res.status(404).json({
          error: 'Consulta não encontrada.',
          message: 'A consulta indicada não existe.'
        });
      }

      if (isClientUser(req.user)) {
        const pet = await Pet.findByPk(appointment.id_pet);

        if (!pet || pet.id_user !== req.user.id_user) {
          return res.status(403).json({
            error: 'Acesso negado.',
            message: 'Não tens permissão para visualizar esta consulta.'
          });
        }
      }


      return res.status(200).json(appointment);


    } catch (error) {

      console.error('Erro ao procurar consulta:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível obter a consulta.'
      });

    }
  },


  // LISTAR CONSULTAS DE UM PET
  getAppointmentsByPet: async (req, res) => {
    try {

      const { id } = req.params;


      const pet = await Pet.findByPk(id);


      if (!pet) {
        return res.status(404).json({
          error: 'Pet não encontrado.',
          message: 'O pet indicado não existe.'
        });
      }

      if (isClientUser(req.user) && pet.id_user !== req.user.id_user) {
        return res.status(403).json({
          error: 'Acesso negado.',
          message: 'Não tens permissão para visualizar as consultas deste pet.'
        });
      }


      const appointments = await Appointment.findAll({
        where: {
          id_pet: id
        },
        order: [
          ['data', 'DESC'],
          ['hora', 'DESC']
        ]
      });


      return res.status(200).json(appointments);


    } catch (error) {

      console.error('Erro ao listar consultas do pet:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível carregar as consultas do pet.'
      });

    }
  },


  // CRIAR CONSULTA
  createAppointment: async (req, res) => {
    try {


      const {
        data,
        hora,
        motivo,
        observacoes,
        id_pet,
        id_veterinario,
        id_service
      } = req.body;



      if (!data || !hora || !motivo || !id_pet || !id_veterinario || !id_service) {

        return res.status(400).json({
          error: 'Dados inválidos.',
          message: 'Data, hora, motivo, pet, veterinário e serviço são obrigatórios.'
        });

      }



      const pet = await Pet.findByPk(id_pet);

      if (!pet) {

        return res.status(404).json({
          error: 'Pet não encontrado.',
          message: 'O pet indicado não existe.'
        });

      }



      const veterinarian = await User.findByPk(id_veterinario);

      if (!veterinarian) {

        return res.status(404).json({
          error: 'Veterinário não encontrado.',
          message: 'O veterinário indicado não existe.'
        });

      }



      const service = await Service.findByPk(id_service);

      if (!service) {

        return res.status(404).json({
          error: 'Serviço não encontrado.',
          message: 'O serviço indicado não existe.'
        });

      }



      const appointment = await Appointment.create({

        data,
        hora,
        motivo,
        observacoes,
        id_pet,
        id_veterinario,
        id_service,
        preco_final: service.preco

      });



      return res.status(201).json({

        message: 'Consulta criada com sucesso!',
        appointment

      });



    } catch (error) {

      console.error('Erro ao criar consulta:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível criar a consulta.'
      });

    }
  },


  // ATUALIZAR CONSULTA
  updateAppointment: async (req, res) => {
    try {

      const { id } = req.params;


      const appointment = await Appointment.findByPk(id);


      if (!appointment) {

        return res.status(404).json({
          error: 'Consulta não encontrada.',
          message: 'A consulta indicada não existe.'
        });

      }



      const {
        data,
        hora,
        motivo,
        estado,
        observacoes,
        preco_final,
        motivo_cancelamento,
        data_confirmacao,
        duracao_real
      } = req.body;

      if (data !== undefined) appointment.data = data;
      if (hora !== undefined) appointment.hora = hora;
      if (motivo !== undefined) appointment.motivo = motivo;
      if (estado !== undefined) appointment.estado = normalizeAppointmentStatus(estado);
      if (observacoes !== undefined) appointment.observacoes = observacoes;
      if (preco_final !== undefined) appointment.preco_final = preco_final;
      if (motivo_cancelamento !== undefined) appointment.motivo_cancelamento = motivo_cancelamento;
      if (data_confirmacao !== undefined) appointment.data_confirmacao = data_confirmacao;
      if (duracao_real !== undefined) appointment.duracao_real = duracao_real;

      if (!appointment.data) {
        appointment.data = new Date().toISOString().slice(0, 10);
      }

      if (!appointment.hora) {
        appointment.hora = '00:00:00';
      }

      if (!appointment.motivo) {
        appointment.motivo = 'Consulta';
      }

      await appointment.save();



      return res.status(200).json({

        message: 'Consulta atualizada com sucesso!',
        appointment

      });



    } catch (error) {

      console.error('Erro ao atualizar consulta:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível atualizar a consulta.'
      });

    }
  },


  // ELIMINAR CONSULTA
  deleteAppointment: async (req, res) => {
    try {


      const { id } = req.params;


      const appointment = await Appointment.findByPk(id);



      if (!appointment) {

        return res.status(404).json({
          error: 'Consulta não encontrada.',
          message: 'A consulta indicada não existe.'
        });

      }



      await appointment.destroy();



      return res.status(200).json({

        message: 'Consulta eliminada com sucesso.'

      });



    } catch (error) {

      console.error('Erro ao eliminar consulta:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível eliminar a consulta.'
      });

    }
  }


};


module.exports = appointmentController;
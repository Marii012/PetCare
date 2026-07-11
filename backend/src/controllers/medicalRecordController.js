const MedicalRecord = require('../models/medicalRecordModel');
const Pet = require('../models/petModel');
const User = require('../models/userModel');
const Appointment = require('../models/appointmentModel');


const medicalRecordController = {


  // LISTAR TODOS OS REGISTOS MÉDICOS
  getAllMedicalRecords: async (req, res) => {
    try {

      const records = await MedicalRecord.findAll({
        order: [
          ['data_registo', 'DESC']
        ]
      });

      return res.status(200).json(records);

    } catch (error) {

      console.error('Erro ao listar registos médicos:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível carregar os registos médicos.'
      });

    }
  },


  // OBTER REGISTO MÉDICO POR ID
  getMedicalRecordById: async (req, res) => {
    try {

      const { id } = req.params;

      const record = await MedicalRecord.findByPk(id);


      if (!record) {
        return res.status(404).json({
          error: 'Registo médico não encontrado.',
          message: 'O registo indicado não existe.'
        });
      }


      return res.status(200).json(record);


    } catch (error) {

      console.error('Erro ao procurar registo médico:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível obter o registo médico.'
      });

    }
  },


  // LISTAR REGISTOS DE UM PET
  getMedicalRecordsByPet: async (req, res) => {
    try {

      const { id } = req.params;


      const pet = await Pet.findByPk(id);


      if (!pet) {
        return res.status(404).json({
          error: 'Pet não encontrado.',
          message: 'O pet indicado não existe.'
        });
      }


      const records = await MedicalRecord.findAll({
        where: {
          id_pet: id
        },
        order: [
          ['data_registo', 'DESC']
        ]
      });


      return res.status(200).json(records);


    } catch (error) {

      console.error('Erro ao listar histórico médico:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível carregar o histórico médico.'
      });

    }
  },


  // CRIAR REGISTO MÉDICO
  createMedicalRecord: async (req, res) => {
    try {


      const {
        diagnostico,
        sintomas,
        tratamento_receitado,
        data_registo,
        id_pet,
        id_veterinario,
        id_appointment,
        peso,
        temperatura,
        frequencia_cardiaca,
        recomendacoes
      } = req.body;



      if (!diagnostico || !id_pet || !id_veterinario) {

        return res.status(400).json({
          error: 'Dados inválidos.',
          message: 'Diagnóstico, pet e veterinário são obrigatórios.'
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



      if (id_appointment) {

        const appointment = await Appointment.findByPk(id_appointment);

        if (!appointment) {

          return res.status(404).json({
            error: 'Consulta não encontrada.',
            message: 'A consulta indicada não existe.'
          });

        }

      }



      const record = await MedicalRecord.create({

        diagnostico,
        sintomas,
        tratamento_receitado,
        data_registo,
        id_pet,
        id_veterinario,
        id_appointment,
        peso,
        temperatura,
        frequencia_cardiaca,
        recomendacoes

      });



      return res.status(201).json({

        message: 'Registo médico criado com sucesso!',
        record

      });



    } catch (error) {

      console.error('Erro ao criar registo médico:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível criar o registo médico.'
      });

    }
  },



  // ATUALIZAR REGISTO MÉDICO
  updateMedicalRecord: async (req, res) => {
    try {


      const { id } = req.params;


      const record = await MedicalRecord.findByPk(id);


      if (!record) {

        return res.status(404).json({
          error: 'Registo médico não encontrado.',
          message: 'O registo indicado não existe.'
        });

      }



      const {
        diagnostico,
        sintomas,
        tratamento_receitado,
        peso,
        temperatura,
        frequencia_cardiaca,
        recomendacoes
      } = req.body;



      if (diagnostico) record.diagnostico = diagnostico;
      if (sintomas) record.sintomas = sintomas;
      if (tratamento_receitado) record.tratamento_receitado = tratamento_receitado;
      if (peso) record.peso = peso;
      if (temperatura) record.temperatura = temperatura;
      if (frequencia_cardiaca) record.frequencia_cardiaca = frequencia_cardiaca;
      if (recomendacoes) record.recomendacoes = recomendacoes;



      await record.save();



      return res.status(200).json({

        message: 'Registo médico atualizado com sucesso!',
        record

      });



    } catch (error) {

      console.error('Erro ao atualizar registo médico:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível atualizar o registo médico.'
      });

    }
  },



  // ELIMINAR REGISTO MÉDICO
  deleteMedicalRecord: async (req, res) => {
    try {


      const { id } = req.params;


      const record = await MedicalRecord.findByPk(id);



      if (!record) {

        return res.status(404).json({
          error: 'Registo médico não encontrado.',
          message: 'O registo indicado não existe.'
        });

      }



      await record.destroy();



      return res.status(200).json({

        message: 'Registo médico eliminado com sucesso.'

      });



    } catch (error) {

      console.error('Erro ao eliminar registo médico:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível eliminar o registo médico.'
      });

    }
  }


};


module.exports = medicalRecordController;
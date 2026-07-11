const Vaccine = require('../models/vaccinesModel');
const Pet = require('../models/petModel');
const User = require('../models/userModel');

const vaccineController = {


  // LISTAR TODAS AS VACINAS
  getAllVaccines: async (req, res) => {
    try {

      const vaccines = await Vaccine.findAll({
        order: [
          ['data_administracao', 'DESC']
        ]
      });

      return res.status(200).json(vaccines);

    } catch (error) {

      console.error('Erro ao listar vacinas:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível carregar as vacinas.'
      });

    }
  },


  // OBTER VACINA POR ID
  getVaccineById: async (req, res) => {
    try {

      const { id } = req.params;

      const vaccine = await Vaccine.findByPk(id);

      if (!vaccine) {
        return res.status(404).json({
          error: 'Vacina não encontrada.',
          message: 'A vacina indicada não existe.'
        });
      }

      return res.status(200).json(vaccine);

    } catch (error) {

      console.error('Erro ao procurar vacina:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível obter a vacina.'
      });

    }
  },


  // LISTAR VACINAS DE UM PET
  getVaccinesByPet: async (req, res) => {
    try {

      const { id } = req.params;

      const pet = await Pet.findByPk(id);

      if (!pet) {
        return res.status(404).json({
          error: 'Pet não encontrado.',
          message: 'O pet indicado não existe.'
        });
      }


      const vaccines = await Vaccine.findAll({
        where: {
          id_pet: id
        },
        order: [
          ['data_administracao', 'DESC']
        ]
      });


      return res.status(200).json(vaccines);


    } catch (error) {

      console.error('Erro ao listar vacinas do pet:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível carregar as vacinas do pet.'
      });

    }
  },


  // CRIAR VACINA
  createVaccine: async (req, res) => {
    try {

      const {
        nome_vacina,
        data_administracao,
        proxima_dose,
        observacoes,
        id_pet,
        id_veterinario,
        fabricante,
        lote_vacina
      } = req.body;


      if (!nome_vacina || !data_administracao || !id_pet) {
        return res.status(400).json({
          error: 'Dados inválidos.',
          message: 'Nome da vacina, data de administração e pet são obrigatórios.'
        });
      }


      const pet = await Pet.findByPk(id_pet);

      if (!pet) {
        return res.status(404).json({
          error: 'Pet não encontrado.',
          message: 'O pet indicado não existe.'
        });
      }


      const vaccine = await Vaccine.create({
        nome_vacina,
        data_administracao,
        proxima_dose,
        observacoes,
        id_pet,
        id_veterinario,
        fabricante,
        lote_vacina
      });


      return res.status(201).json({
        message: 'Vacina criada com sucesso!',
        vaccine
      });


    } catch (error) {

      console.error('Erro ao criar vacina:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível criar a vacina.'
      });

    }
  },


  // ATUALIZAR VACINA
  updateVaccine: async (req, res) => {
    try {

      const { id } = req.params;

      const vaccine = await Vaccine.findByPk(id);


      if (!vaccine) {
        return res.status(404).json({
          error: 'Vacina não encontrada.',
          message: 'A vacina indicada não existe.'
        });
      }


      const {
        nome_vacina,
        data_administracao,
        proxima_dose,
        observacoes,
        id_veterinario,
        fabricante,
        lote_vacina
      } = req.body;


      if (nome_vacina) vaccine.nome_vacina = nome_vacina;
      if (data_administracao) vaccine.data_administracao = data_administracao;
      if (proxima_dose) vaccine.proxima_dose = proxima_dose;
      if (observacoes) vaccine.observacoes = observacoes;
      if (id_veterinario) vaccine.id_veterinario = id_veterinario;
      if (fabricante) vaccine.fabricante = fabricante;
      if (lote_vacina) vaccine.lote_vacina = lote_vacina;


      await vaccine.save();


      return res.status(200).json({
        message: 'Vacina atualizada com sucesso!',
        vaccine
      });


    } catch (error) {

      console.error('Erro ao atualizar vacina:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível atualizar a vacina.'
      });

    }
  },


  // ELIMINAR VACINA
  deleteVaccine: async (req, res) => {
    try {

      const { id } = req.params;

      const vaccine = await Vaccine.findByPk(id);


      if (!vaccine) {
        return res.status(404).json({
          error: 'Vacina não encontrada.',
          message: 'A vacina indicada não existe.'
        });
      }


      await vaccine.destroy();


      return res.status(200).json({
        message: 'Vacina eliminada com sucesso.'
      });


    } catch (error) {

      console.error('Erro ao eliminar vacina:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível eliminar a vacina.'
      });

    }
  }

};


module.exports = vaccineController;
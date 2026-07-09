const Species = require('../models/speciesModel');

const speciesController = {

  // LISTAR TODAS AS ESPÉCIES
  getAllSpecies: async (req, res) => {
    try {

      const species = await Species.findAll({
        order: [['nome_especie', 'ASC']]
      });

      return res.status(200).json(species);

    } catch (error) {

      console.error('Erro ao listar espécies:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível carregar a lista de espécies.'
      });

    }
  },

  // OBTER ESPÉCIE POR ID
  getSpeciesById: async (req, res) => {
    try {

      const { id } = req.params;

      const species = await Species.findByPk(id);

      if (!species) {
        return res.status(404).json({
          error: 'Espécie não encontrada.',
          message: 'A espécie indicada não existe.'
        });
      }

      return res.status(200).json(species);

    } catch (error) {

      console.error('Erro ao procurar espécie:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível obter a espécie.'
      });

    }
  },

  // CRIAR ESPÉCIE
  createSpecies: async (req, res) => {
    try {

      const { nome_especie } = req.body;

      if (!nome_especie) {
        return res.status(400).json({
          error: 'Dados inválidos.',
          message: 'O nome da espécie é obrigatório.'
        });
      }

      const existingSpecies = await Species.findOne({
        where: { nome_especie }
      });

      if (existingSpecies) {
        return res.status(409).json({
          error: 'Espécie existente.',
          message: 'Já existe uma espécie com esse nome.'
        });
      }

      const species = await Species.create({
        nome_especie
      });

      return res.status(201).json({
        message: 'Espécie criada com sucesso!',
        species
      });

    } catch (error) {

      console.error('Erro ao criar espécie:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível criar a espécie.'
      });

    }
  },

  // ATUALIZAR ESPÉCIE
  updateSpecies: async (req, res) => {
    try {

      const { id } = req.params;
      const { nome_especie } = req.body;

      const species = await Species.findByPk(id);

      if (!species) {
        return res.status(404).json({
          error: 'Espécie não encontrada.',
          message: 'A espécie indicada não existe.'
        });
      }

      if (nome_especie && nome_especie !== species.nome_especie) {

        const existingSpecies = await Species.findOne({
          where: { nome_especie }
        });

        if (existingSpecies) {
          return res.status(409).json({
            error: 'Espécie existente.',
            message: 'Já existe uma espécie com esse nome.'
          });
        }

        species.nome_especie = nome_especie;
      }

      await species.save();

      return res.status(200).json({
        message: 'Espécie atualizada com sucesso!',
        species
      });

    } catch (error) {

      console.error('Erro ao atualizar espécie:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível atualizar a espécie.'
      });

    }
  },

  // ELIMINAR ESPÉCIE
  deleteSpecies: async (req, res) => {
    try {

      const { id } = req.params;

      const species = await Species.findByPk(id);

      if (!species) {
        return res.status(404).json({
          error: 'Espécie não encontrada.',
          message: 'A espécie indicada não existe.'
        });
      }

      await species.destroy();

      return res.status(200).json({
        message: 'Espécie eliminada com sucesso.'
      });

    } catch (error) {

      console.error('Erro ao eliminar espécie:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível eliminar a espécie.'
      });

    }
  }

};

module.exports = speciesController;
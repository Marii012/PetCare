const sequelize = require('../database/database-remote')
const Breed = require('../models/breedModel');
const Species = require('../models/speciesModel');

const breedController = {

  // LISTAR TODAS AS RAÇAS
  getAllBreeds: async (req, res) => {
    try {

      const breeds = await Breed.findAll({
        order: [
          [
            sequelize.literal(`
              CASE
                WHEN nome_raca = 'Desconhecida' THEN 1
                WHEN nome_raca = 'Outra' THEN 2
                ELSE 0
              END
            `),
            'ASC'
          ],
          ['nome_raca', 'ASC']
        ]
      });

      return res.status(200).json(breeds);

    } catch (error) {

      console.error('Erro ao listar raças:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível carregar a lista de raças.'
      });

    }
  },

  // OBTER RAÇA POR ID
  getBreedById: async (req, res) => {
    try {

      const { id } = req.params;

      const breed = await Breed.findByPk(id);

      if (!breed) {
        return res.status(404).json({
          error: 'Raça não encontrada.',
          message: 'A raça indicada não existe.'
        });
      }

      return res.status(200).json(breed);

    } catch (error) {

      console.error('Erro ao procurar raça:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível obter a raça.'
      });

    }
  },

  // LISTAR RAÇAS POR ESPÉCIE
  getBreedsBySpecies: async (req, res) => {
    try {

      const { id } = req.params;

      const species = await Species.findByPk(id);

      if (!species) {
        return res.status(404).json({
          error: 'Espécie não encontrada.',
          message: 'A espécie indicada não existe.'
        });
      }

      const breeds = await Breed.findAll({
        where: { id_species: id },
        order: [
          [
            sequelize.literal(`
              CASE
                WHEN nome_raca = 'Desconhecida' THEN 1
                WHEN nome_raca = 'Outra' THEN 2
                ELSE 0
              END
            `),
            'ASC'
          ],
          ['nome_raca', 'ASC']
        ]
      });

      return res.status(200).json(breeds);

    } catch (error) {

      console.error('Erro ao listar raças:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível carregar a lista de raças.'
      });

    }
  },

  // CRIAR RAÇA
  createBreed: async (req, res) => {
    try {

      const { nome_raca, id_species } = req.body;

      if (!nome_raca || !id_species) {
        return res.status(400).json({
          error: 'Dados inválidos.',
          message: 'Nome da raça e espécie são obrigatórios.'
        });
      }

      const species = await Species.findByPk(id_species);

      if (!species) {
        return res.status(404).json({
          error: 'Espécie não encontrada.',
          message: 'A espécie indicada não existe.'
        });
      }

      const breed = await Breed.create({
        nome_raca,
        id_species
      });

      return res.status(201).json({
        message: 'Raça criada com sucesso!',
        breed
      });

    } catch (error) {

      console.error('Erro ao criar raça:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível criar a raça.'
      });

    }
  },

  // ATUALIZAR RAÇA
  updateBreed: async (req, res) => {
    try {

      const { id } = req.params;
      const { nome_raca, id_species } = req.body;

      const breed = await Breed.findByPk(id);

      if (!breed) {
        return res.status(404).json({
          error: 'Raça não encontrada.',
          message: 'A raça indicada não existe.'
        });
      }

      if (nome_raca) breed.nome_raca = nome_raca;
      if (id_species) breed.id_species = id_species;

      await breed.save();

      return res.status(200).json({
        message: 'Raça atualizada com sucesso!',
        breed
      });

    } catch (error) {

      console.error('Erro ao atualizar raça:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível atualizar a raça.'
      });

    }
  },

  // ELIMINAR RAÇA
  deleteBreed: async (req, res) => {
    try {

      const { id } = req.params;

      const breed = await Breed.findByPk(id);

      if (!breed) {
        return res.status(404).json({
          error: 'Raça não encontrada.',
          message: 'A raça indicada não existe.'
        });
      }

      await breed.destroy();

      return res.status(200).json({
        message: 'Raça eliminada com sucesso.'
      });

    } catch (error) {

      console.error('Erro ao eliminar raça:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível eliminar a raça.'
      });

    }
  }

};

module.exports = breedController;
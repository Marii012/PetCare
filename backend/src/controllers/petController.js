const Pet = require('../models/petModel');
const User = require('../models/userModel');
const Species = require('../models/speciesModel');
const Breed = require('../models/breedModel');

const petController = {

  // LISTAR TODOS OS PETS
  getAllPets: async (req, res) => {
    try {

      const pets = await Pet.findAll({
        include: [
          {
            model: Breed,
            attributes: ['nome_raca']
          }
        ],
        order: [
          ['nome', 'ASC']
        ]
      });

      const petsWithBreedName = pets.map((pet) => {
        const petData = pet.toJSON();
        petData.nome_raca = petData.Breed?.nome_raca || null;
        return petData;
      });

      return res.status(200).json(petsWithBreedName);

    } catch (error) {

      console.error('Erro ao listar pets:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível carregar a lista de pets.'
      });

    }
  },


  // OBTER PET POR ID
  getPetById: async (req, res) => {
    try {

      const { id } = req.params;

      const pet = await Pet.findByPk(id, {
        include: [
          {
            model: Breed,
            attributes: ['nome_raca']
          }
        ]
      });

      if (!pet) {
        return res.status(404).json({
          error: 'Pet não encontrado.',
          message: 'O pet indicado não existe.'
        });
      }

      const petData = pet.toJSON();
      petData.nome_raca = petData.Breed?.nome_raca || null;

      return res.status(200).json(petData);

    } catch (error) {

      console.error('Erro ao procurar pet:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível obter o pet.'
      });

    }
  },


  // LISTAR PETS POR UTILIZADOR
  getPetsByUser: async (req, res) => {
    try {

      const { id } = req.params;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          error: 'Utilizador não encontrado.',
          message: 'O utilizador indicado não existe.'
        });
      }

      const pets = await Pet.findAll({
        where: {
          id_user: id
        },
        include: [
          {
            model: Breed,
            attributes: ['nome_raca']
          }
        ],
        order: [
          ['nome', 'ASC']
        ]
      });

      const petsWithBreedName = pets.map((pet) => {
        const petData = pet.toJSON();
        petData.nome_raca = petData.Breed?.nome_raca || null;
        return petData;
      });

      return res.status(200).json(petsWithBreedName);

    } catch (error) {

      console.error('Erro ao listar pets do utilizador:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível carregar os pets do utilizador.'
      });

    }
  },


  // CRIAR PET
  createPet: async (req, res) => {
    try {

      const {
        nome,
        sexo,
        data_nascimento,
        peso,
        num_chip,
        fotografia,
        id_species,
        id_breed,
        id_user,
        cor,
        esterilizado,
        alergias,
        observacoes,
        porte
      } = req.body;


      if (!nome || !id_species || !id_user) {
        return res.status(400).json({
          error: 'Dados inválidos.',
          message: 'Nome, espécie e utilizador são obrigatórios.'
        });
      }


      const species = await Species.findByPk(id_species);

      if (!species) {
        return res.status(404).json({
          error: 'Espécie não encontrada.',
          message: 'A espécie indicada não existe.'
        });
      }


      const user = await User.findByPk(id_user);

      if (!user) {
        return res.status(404).json({
          error: 'Utilizador não encontrado.',
          message: 'O utilizador indicado não existe.'
        });
      }


      if (id_breed) {

        const breed = await Breed.findByPk(id_breed);

        if (!breed) {
          return res.status(404).json({
            error: 'Raça não encontrada.',
            message: 'A raça indicada não existe.'
          });
        }

      }


      const pet = await Pet.create({
        nome,
        sexo,
        data_nascimento,
        peso,
        num_chip,
        fotografia,
        id_species,
        id_breed,
        id_user,
        cor,
        esterilizado,
        alergias,
        observacoes,
        porte
      });


      return res.status(201).json({
        message: 'Pet criado com sucesso!',
        pet
      });


    } catch (error) {

      console.error('Erro ao criar pet:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível criar o pet.'
      });

    }
  },


  // ATUALIZAR PET
  updatePet: async (req, res) => {
    try {

      const { id } = req.params;

      const pet = await Pet.findByPk(id);

      if (!pet) {
        return res.status(404).json({
          error: 'Pet não encontrado.',
          message: 'O pet indicado não existe.'
        });
      }


      const {
        nome,
        sexo,
        data_nascimento,
        peso,
        num_chip,
        fotografia,
        id_species,
        id_breed,
        cor,
        esterilizado,
        alergias,
        observacoes,
        porte,
        estado
      } = req.body;


      if (nome) pet.nome = nome;
      if (sexo) pet.sexo = sexo;
      if (data_nascimento) pet.data_nascimento = data_nascimento;
      if (peso) pet.peso = peso;
      if (num_chip) pet.num_chip = num_chip;
      if (fotografia) pet.fotografia = fotografia;
      if (id_species) pet.id_species = id_species;
      if (id_breed) pet.id_breed = id_breed;
      if (cor) pet.cor = cor;
      if (esterilizado !== undefined) pet.esterilizado = esterilizado;
      if (alergias) pet.alergias = alergias;
      if (observacoes) pet.observacoes = observacoes;
      if (porte) pet.porte = porte;
      if (estado) pet.estado = estado;


      await pet.save();


      return res.status(200).json({
        message: 'Pet atualizado com sucesso!',
        pet
      });


    } catch (error) {

      console.error('Erro ao atualizar pet:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível atualizar o pet.'
      });

    }
  },


  // ELIMINAR PET
  deletePet: async (req, res) => {
    try {

      const { id } = req.params;

      const pet = await Pet.findByPk(id);

      if (!pet) {
        return res.status(404).json({
          error: 'Pet não encontrado.',
          message: 'O pet indicado não existe.'
        });
      }


      await pet.destroy();


      return res.status(200).json({
        message: 'Pet eliminado com sucesso.'
      });


    } catch (error) {

      console.error('Erro ao eliminar pet:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível eliminar o pet.'
      });

    }
  }

};


module.exports = petController;
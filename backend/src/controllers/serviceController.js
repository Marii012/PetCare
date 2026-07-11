const Service = require('../models/serviceModel');


const serviceController = {


  // LISTAR TODOS OS SERVIÇOS
  getAllServices: async (req, res) => {
    try {

      const services = await Service.findAll({
        order: [
          ['nome', 'ASC']
        ]
      });


      return res.status(200).json(services);


    } catch (error) {

      console.error('Erro ao listar serviços:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível carregar os serviços.'
      });

    }
  },



  // OBTER SERVIÇO POR ID
  getServiceById: async (req, res) => {
    try {

      const { id } = req.params;


      const service = await Service.findByPk(id);


      if (!service) {

        return res.status(404).json({
          error: 'Serviço não encontrado.',
          message: 'O serviço indicado não existe.'
        });

      }


      return res.status(200).json(service);



    } catch (error) {

      console.error('Erro ao procurar serviço:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível obter o serviço.'
      });

    }
  },




  // CRIAR SERVIÇO
  createService: async (req, res) => {
    try {


      const {
        nome,
        descricao,
        preco,
        duracao,
        ativo
      } = req.body;



      if (!nome || !preco || !duracao) {

        return res.status(400).json({
          error: 'Dados inválidos.',
          message: 'Nome, preço e duração são obrigatórios.'
        });

      }



      const service = await Service.create({

        nome,
        descricao,
        preco,
        duracao,
        ativo

      });



      return res.status(201).json({

        message: 'Serviço criado com sucesso!',
        service

      });



    } catch (error) {

      console.error('Erro ao criar serviço:', error);


      return res.status(500).json({

        error: 'Erro no servidor.',
        message: 'Não foi possível criar o serviço.'

      });

    }
  },





  // ATUALIZAR SERVIÇO
  updateService: async (req, res) => {
    try {


      const { id } = req.params;


      const {
        nome,
        descricao,
        preco,
        duracao,
        ativo
      } = req.body;



      const service = await Service.findByPk(id);



      if (!service) {

        return res.status(404).json({

          error: 'Serviço não encontrado.',
          message: 'O serviço indicado não existe.'

        });

      }




      if (nome !== undefined)
        service.nome = nome;


      if (descricao !== undefined)
        service.descricao = descricao;


      if (preco !== undefined)
        service.preco = preco;


      if (duracao !== undefined)
        service.duracao = duracao;


      if (ativo !== undefined)
        service.ativo = ativo;



      await service.save();



      return res.status(200).json({

        message: 'Serviço atualizado com sucesso!',
        service

      });



    } catch (error) {

      console.error('Erro ao atualizar serviço:', error);


      return res.status(500).json({

        error: 'Erro no servidor.',
        message: 'Não foi possível atualizar o serviço.'

      });

    }
  },







  // ELIMINAR SERVIÇO
  deleteService: async (req, res) => {
    try {


      const { id } = req.params;


      const service = await Service.findByPk(id);



      if (!service) {

        return res.status(404).json({

          error: 'Serviço não encontrado.',
          message: 'O serviço indicado não existe.'

        });

      }




      await service.destroy();



      return res.status(200).json({

        message: 'Serviço eliminado com sucesso.'

      });



    } catch (error) {

      console.error('Erro ao eliminar serviço:', error);



      return res.status(500).json({

        error: 'Erro no servidor.',
        message: 'Não foi possível eliminar o serviço.'

      });

    }
  }


};


module.exports = serviceController;
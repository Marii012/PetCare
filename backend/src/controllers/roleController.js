const Role = require('../models/roleModel');


const roleController = {


  // LISTAR TODOS OS ROLES
  getAllRoles: async (req, res) => {
    try {

      const roles = await Role.findAll({
        order: [
          ['nome_role', 'ASC']
        ]
      });


      return res.status(200).json(roles);


    } catch (error) {

      console.error('Erro ao listar roles:', error);


      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível carregar os roles.'
      });

    }
  },




  // OBTER ROLE POR ID
  getRoleById: async (req, res) => {
    try {

      const { id } = req.params;


      const role = await Role.findByPk(id);



      if (!role) {

        return res.status(404).json({
          error: 'Role não encontrado.',
          message: 'O role indicado não existe.'
        });

      }



      return res.status(200).json(role);



    } catch (error) {

      console.error('Erro ao procurar role:', error);


      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível obter o role.'
      });

    }
  },






  // CRIAR ROLE
  createRole: async (req, res) => {
    try {


      const {
        nome_role
      } = req.body;




      if (!nome_role) {

        return res.status(400).json({
          error: 'Dados inválidos.',
          message: 'O nome do role é obrigatório.'
        });

      }




      const role = await Role.create({

        nome_role

      });





      return res.status(201).json({

        message: 'Role criado com sucesso!',
        role

      });




    } catch (error) {


      console.error('Erro ao criar role:', error);



      return res.status(500).json({

        error: 'Erro no servidor.',
        message: 'Não foi possível criar o role.'

      });


    }
  },








  // ATUALIZAR ROLE
  updateRole: async (req, res) => {
    try {


      const { id } = req.params;


      const {
        nome_role
      } = req.body;




      const role = await Role.findByPk(id);




      if (!role) {

        return res.status(404).json({

          error: 'Role não encontrado.',
          message: 'O role indicado não existe.'

        });

      }





      if (nome_role !== undefined) {

        role.nome_role = nome_role;

      }





      await role.save();




      return res.status(200).json({

        message: 'Role atualizado com sucesso!',
        role

      });





    } catch (error) {


      console.error('Erro ao atualizar role:', error);



      return res.status(500).json({

        error: 'Erro no servidor.',
        message: 'Não foi possível atualizar o role.'

      });


    }
  },









  // ELIMINAR ROLE
  deleteRole: async (req, res) => {
    try {


      const { id } = req.params;



      const role = await Role.findByPk(id);




      if (!role) {

        return res.status(404).json({

          error: 'Role não encontrado.',
          message: 'O role indicado não existe.'

        });

      }





      await role.destroy();




      return res.status(200).json({

        message: 'Role eliminado com sucesso.'

      });





    } catch (error) {


      console.error('Erro ao eliminar role:', error);



      return res.status(500).json({

        error: 'Erro no servidor.',
        message: 'Não foi possível eliminar o role.'

      });


    }
  }


};


module.exports = roleController;
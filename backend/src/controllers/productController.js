const Product = require('../models/productModel');


const productController = {


  // LISTAR TODOS OS PRODUTOS
  getAllProducts: async (req, res) => {
    try {

      const products = await Product.findAll({
        order: [
          ['nome', 'ASC']
        ]
      });


      return res.status(200).json(products);


    } catch (error) {

      console.error('Erro ao listar produtos:', error);

      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível carregar os produtos.'
      });

    }
  },



  // OBTER PRODUTO POR ID
  getProductById: async (req, res) => {
    try {

      const { id } = req.params;


      const product = await Product.findByPk(id);


      if (!product) {

        return res.status(404).json({
          error: 'Produto não encontrado.',
          message: 'O produto indicado não existe.'
        });

      }


      return res.status(200).json(product);


    } catch (error) {

      console.error('Erro ao procurar produto:', error);


      return res.status(500).json({
        error: 'Erro no servidor.',
        message: 'Não foi possível obter o produto.'
      });

    }
  },





  // CRIAR PRODUTO
  createProduct: async (req, res) => {
    try {


      const {
        nome,
        codigo_barras,
        preco_venda,
        stock_atual,
        stock_minimo,
        descricao,
        fornecedor,
        imagem,
        categoria
      } = req.body;



      if (!nome || !preco_venda) {

        return res.status(400).json({
          error: 'Dados inválidos.',
          message: 'Nome e preço de venda são obrigatórios.'
        });

      }




      const product = await Product.create({

        nome,
        codigo_barras,
        preco_venda,
        stock_atual,
        stock_minimo,
        descricao,
        fornecedor,
        imagem,
        categoria

      });



      return res.status(201).json({

        message: 'Produto criado com sucesso!',
        product

      });



    } catch (error) {

      console.error('Erro ao criar produto:', error);


      return res.status(500).json({

        error: 'Erro no servidor.',
        message: 'Não foi possível criar o produto.'

      });

    }
  },







  // ATUALIZAR PRODUTO
  updateProduct: async (req, res) => {
    try {


      const { id } = req.params;


      const product = await Product.findByPk(id);



      if (!product) {

        return res.status(404).json({

          error: 'Produto não encontrado.',
          message: 'O produto indicado não existe.'

        });

      }



      const campos = [

        'nome',
        'codigo_barras',
        'preco_venda',
        'stock_atual',
        'stock_minimo',
        'descricao',
        'fornecedor',
        'imagem',
        'categoria'

      ];



      campos.forEach(campo => {

        if (req.body[campo] !== undefined) {

          product[campo] = req.body[campo];

        }

      });



      await product.save();



      return res.status(200).json({

        message: 'Produto atualizado com sucesso!',
        product

      });



    } catch (error) {

      console.error('Erro ao atualizar produto:', error);


      return res.status(500).json({

        error: 'Erro no servidor.',
        message: 'Não foi possível atualizar o produto.'

      });

    }
  },







  // ELIMINAR PRODUTO
  deleteProduct: async (req, res) => {
    try {


      const { id } = req.params;


      const product = await Product.findByPk(id);



      if (!product) {

        return res.status(404).json({

          error: 'Produto não encontrado.',
          message: 'O produto indicado não existe.'

        });

      }



      await product.destroy();



      return res.status(200).json({

        message: 'Produto eliminado com sucesso.'

      });



    } catch (error) {

      console.error('Erro ao eliminar produto:', error);


      return res.status(500).json({

        error: 'Erro no servidor.',
        message: 'Não foi possível eliminar o produto.'

      });

    }
  }


};


module.exports = productController;
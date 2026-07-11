const express = require('express');

const router = express.Router();

const productController = require('../controllers/productController');



// LISTAR PRODUTOS
router.get(
  '/',
  productController.getAllProducts
);



// OBTER PRODUTO POR ID
router.get(
  '/:id',
  productController.getProductById
);



// CRIAR PRODUTO
router.post(
  '/',
  productController.createProduct
);



// ATUALIZAR PRODUTO
router.put(
  '/:id',
  productController.updateProduct
);



// ELIMINAR PRODUTO
router.delete(
  '/:id',
  productController.deleteProduct
);



module.exports = router;
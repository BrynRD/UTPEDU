const express = require('express');
const categoriaController = require('../controllers/categoriaController');

const router = express.Router();

// Rutas de categorías
router.get('/', categoriaController.getAllCategorias);
router.get('/:id', categoriaController.getCategoriaById);

module.exports = router;
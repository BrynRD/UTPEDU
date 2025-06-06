const express = require('express');
const categoriaController = require('../controllers/categoriaController');
const { verificarToken } = require('../middlewares/auth');

const router = express.Router();

// Rutas públicas
router.get('/', categoriaController.getAllCategorias);

// Rutas protegidas (solo admin)
router.post('/', verificarToken, categoriaController.createCategoria);
router.put('/:id', verificarToken, categoriaController.updateCategoria);
router.delete('/:id', verificarToken, categoriaController.deleteCategoria);

module.exports = router;
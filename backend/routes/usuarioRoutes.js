const express = require('express');
const usuarioController = require('../controllers/usuarioController');
const { verificarToken, verificarRol } = require('../middlewares/auth');

const router = express.Router();

// Rutas de usuario
router.get('/perfil', verificarToken, usuarioController.getPerfil);
router.put('/perfil', verificarToken, usuarioController.updatePerfil);

// Ruta para cambiar contraseña - CORREGIDA
router.post('/cambiar-password', verificarToken, usuarioController.cambiarPassword);

// Rutas de administración de usuarios (solo admin)
router.get('/admin/usuarios', verificarToken, verificarRol(['admin']), usuarioController.getAllUsuarios);

module.exports = router;
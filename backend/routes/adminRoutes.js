const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Rutas de usuarios
router.get('/usuarios', adminController.getUsuarios);
router.get('/usuarios/:id', adminController.getUsuario);
router.put('/usuarios/:id', adminController.updateUsuario);
router.put('/usuarios/:id/password', adminController.changeUserPassword);
router.post('/usuarios', adminController.createUsuario);

// Rutas de permisos
router.get('/usuarios/:id/permisos', adminController.getPermisos);
router.put('/usuarios/:id/permisos', adminController.updatePermisos);

// Rutas de estadísticas y recursos
router.get('/estadisticas', adminController.getEstadisticas);
router.get('/recursos/populares', adminController.getRecursosPopulares);
// Añade esta línea junto con las otras rutas de usuario

// Ruta para activar/desactivar usuario
router.put('/usuarios/:id/activo', adminController.toggleUsuarioActivo);

// Add Delete User Route
router.delete('/usuarios/:id', adminController.deleteUsuario);

module.exports = router;
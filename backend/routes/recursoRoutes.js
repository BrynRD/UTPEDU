const express = require('express');
const recursoController = require('../controllers/recursoController');
const { verificarToken } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

const router = express.Router();

// Rutas de recursos
router.post('/', verificarToken, upload.single('archivo'), recursoController.createRecurso);
router.get('/', recursoController.getAllRecursos);
router.get('/mis-recursos', verificarToken, recursoController.getMisRecursos);
router.get('/:id', recursoController.getRecursoById);
router.put('/:id', verificarToken, upload.single('archivo'), recursoController.updateRecurso);
router.delete('/:id', verificarToken, recursoController.deleteRecurso);

// Ruta para descargar un recurso por su ID
router.get('/descargar/:id', verificarToken, recursoController.downloadRecurso);

module.exports = router;
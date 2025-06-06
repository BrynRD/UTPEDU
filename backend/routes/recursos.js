const express = require('express');
const router = express.Router();
const recursoController = require('../controllers/recursoController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

console.log('Recurso Routes: Loading router definitions.'); // Log at the beginning of the file

// Rutas protegidas que requieren autenticación
router.use(authMiddleware);

// Ruta para descargar un recurso (Moved to be more specific)
router.get('/download/:id', (req, res, next) => {
  console.log('Recurso Routes: Attempting to match /download/:id', req.params.id); // Log before controller
  next(); // Continue to the controller
}, recursoController.downloadRecurso);

// Obtener estadísticas de recursos
router.get('/estadisticas', recursoController.getEstadisticas);

// Obtener todos los recursos
router.get('/', recursoController.getAllRecursos);

// Obtener recursos del usuario actual
router.get('/mis-recursos', recursoController.getMisRecursos);

// Obtener un recurso específico (More general route)
router.get('/:id', recursoController.getRecursoById);

// Crear un nuevo recurso
router.post('/', upload.single('archivo'), recursoController.createRecurso);

// Actualizar un recurso
router.put('/:id', recursoController.updateRecurso);

// Eliminar un recurso
router.delete('/:id', recursoController.deleteRecurso);

console.log('Recurso Routes: Router definitions loaded.'); // Log at the end of the file

module.exports = router; 
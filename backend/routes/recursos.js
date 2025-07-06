const express = require('express');
const router = express.Router();
const recursoController = require('../controllers/recursoController');
const { verificarToken } = require('../middlewares/auth');
const upload = require('../middlewares/upload');

console.log('Recurso Routes: Loading router definitions.');

// Log para debug de todas las rutas
router.use((req, res, next) => {
  console.log('🔍 RECURSOS ROUTER: Checking path:', req.path, 'Method:', req.method);
  next();
});

// RUTAS PÚBLICAS (SIN AUTENTICACIÓN) - Para estudiantes
router.get('/publicos', recursoController.getRecursosPublicos);
router.get('/download/:id', (req, res, next) => {
  console.log('🔥 DOWNLOAD ROUTE HIT: ID =', req.params.id);
  recursoController.downloadRecurso(req, res, next);
});

// Rutas protegidas que requieren autenticación
router.use(verificarToken);

// Obtener estadísticas de recursos
router.get('/estadisticas', recursoController.getEstadisticas);

// Obtener todos los recursos
router.get('/', recursoController.getAllRecursos);

// Obtener recursos del usuario actual
router.get('/mis-recursos', recursoController.getMisRecursos);

// Crear un nuevo recurso
router.post('/', upload.single('archivo'), recursoController.createRecurso);

// Actualizar un recurso
router.put('/:id', upload.single('archivo'), recursoController.updateRecurso);

// Eliminar un recurso
router.delete('/:id', recursoController.deleteRecurso);

console.log('Recurso Routes: Router definitions loaded.');

// Obtener un recurso específico (DEBE IR AL FINAL - ruta más general)
router.get('/:id', recursoController.getRecursoById);

module.exports = router;
const express = require('express');
const router = express.Router();
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const Incidencia = require('../models/Incidencia');
const { verificarToken } = require('../middlewares/auth');

const POWER_AUTOMATE_WEBHOOK = process.env.POWER_AUTOMATE_WEBHOOK;
const IMGBB_API_KEY = process.env.IMGBB_API_KEY; 

const upload = multer({ dest: 'temp-uploads/' });

router.post('/', verificarToken, upload.single('imagen'), async (req, res) => {
  try {
    const { nombre, email, asunto, descripcion } = req.body;
    let imagenUrl = '';
    
    if (!nombre || !email || !asunto || !descripcion) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
    }
    
    // Si hay imagen, subirla a imgbb
    if (req.file) {
      if (!IMGBB_API_KEY) {
        return res.status(500).json({ mensaje: 'Error de configuración del servidor (ImgBB)' });
      }
      
      const formData = new FormData();
      formData.append('image', fs.readFileSync(req.file.path), req.file.originalname);
      formData.append('key', IMGBB_API_KEY);
      
      const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
        headers: formData.getHeaders(),
      });
      
      imagenUrl = response.data.data.url;
      fs.unlinkSync(req.file.path); // Borra el archivo temporal
    }
    // Guardar en la base de datos usando el modelo
    await Incidencia.create({
      nombre,
      email,
      asunto,
      descripcion,
      imagenUrl,
      usuario_id: req.usuario ? req.usuario.id : null
    });
    
    // Enviar a Power Automate (opcional)
    if (POWER_AUTOMATE_WEBHOOK) {
      await axios.post(POWER_AUTOMATE_WEBHOOK, {
        nombre,
        email,
        asunto,
        descripcion,
        imagenUrl,
      });
    }
    
    res.status(200).json({ mensaje: 'Incidencia enviada correctamente.' });
  } catch (error) {
    console.error('Error al enviar la incidencia:', error);
    res.status(500).json({ mensaje: 'Error al enviar la incidencia.', error: error.message });
  }
});

// Obtener incidencias por usuario autenticado
router.get('/usuario', verificarToken, async (req, res) => {
  try {
    const usuario_id = req.usuario.id;
    const incidencias = await Incidencia.findByUsuarioId(usuario_id);
    res.json({ incidencias });
  } catch (error) {
    console.error('Error al obtener incidencias:', error);
    res.status(500).json({ mensaje: 'Error al obtener incidencias.', error: error.message });
  }
});

// Obtener todas las incidencias (para admin)
router.get('/admin', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado. Solo administradores.' });
    }
    // Leer parámetros de query
    const {
      page = 1,
      limit = 20,
      estado,
      usuario_id,
      fecha_inicio,
      fecha_fin
    } = req.query;
    const params = {
      page: Number(page),
      limit: Number(limit),
      estado,
      usuario_id,
      fecha_inicio,
      fecha_fin
    };
    const { rows, total } = await Incidencia.findAllWithUsuarioPaginado(params);
    const totalPages = Math.ceil(total / (params.limit || 20));
    res.json({ incidencias: rows, total, page: params.page, totalPages });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener incidencias.', error: error.message });
  }
});

// Obtener estadísticas de incidencias (para admin)
router.get('/admin/stats', verificarToken, async (req, res) => {
  try {
    // Verificar que el usuario sea admin
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado. Solo administradores.' });
    }
    
    const stats = await Incidencia.getStats();
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener estadísticas.', error: error.message });
  }
});

// Actualizar estado de incidencia (para admin)
router.patch('/admin/:id/estado', verificarToken, async (req, res) => {
  try {
    // Verificar que el usuario sea admin
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado. Solo administradores.' });
    }
    
    const { id } = req.params;
    const { estado } = req.body;
    
    if (!estado || !['pendiente', 'en_proceso', 'resuelta'].includes(estado)) {
      return res.status(400).json({ mensaje: 'Estado inválido. Debe ser: pendiente, en_proceso, o resuelta.' });
    }
    
    const success = await Incidencia.updateEstado(id, estado);
    if (!success) {
      return res.status(404).json({ mensaje: 'Incidencia no encontrada.' });
    }
    
    res.json({ mensaje: 'Estado actualizado correctamente.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al actualizar estado.', error: error.message });
  }
});

// Obtener incidencia por ID (para admin)
router.get('/admin/:id', verificarToken, async (req, res) => {
  try {
    // Verificar que el usuario sea admin
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado. Solo administradores.' });
    }
    
    const { id } = req.params;
    const incidencia = await Incidencia.findById(id);
    
    if (!incidencia) {
      return res.status(404).json({ mensaje: 'Incidencia no encontrada.' });
    }
    
    res.json({ incidencia });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener incidencia.', error: error.message });
  }
});

// Eliminar incidencia (para admin)
router.delete('/admin/:id', verificarToken, async (req, res) => {
  try {
    if (req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'Acceso denegado. Solo administradores.' });
    }
    const { id } = req.params;
    const success = await Incidencia.delete(id);
    if (!success) {
      return res.status(404).json({ mensaje: 'Incidencia no encontrada.' });
    }
    res.json({ mensaje: 'Incidencia eliminada correctamente.' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar incidencia.', error: error.message });
  }
});

module.exports = router; 
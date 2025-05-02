const Recurso = require('../models/Recurso');
const path = require('path');
const fs = require('fs');


exports.createRecurso = async (req, res) => {
  try {
    const { titulo, descripcion, categoriaId } = req.body;
    const usuarioId = req.usuario.id;
    
    
    if (!titulo || !descripcion || !categoriaId) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
    
    
    if (!req.file) {
      return res.status(400).json({ mensaje: 'Debe subir un archivo' });
    }
    
    
    const archivoUrl = `/uploads/${req.file.filename}`;
    
    
    const recursoId = await Recurso.create({
      titulo,
      descripcion,
      archivoUrl,
      categoriaId,
      usuarioId
    });
    
    res.status(201).json({
      mensaje: 'Recurso creado correctamente',
      recurso: {
        id: recursoId,
        titulo,
        descripcion,
        archivoUrl,
        categoriaId,
        usuarioId
      }
    });
  } catch (error) {
    console.error('Error al crear recurso:', error);
    res.status(500).json({ mensaje: 'Error al crear recurso' });
  }
};


exports.getAllRecursos = async (req, res) => {
  try {
    const recursos = await Recurso.findAll();
    res.json(recursos);
  } catch (error) {
    console.error('Error al obtener recursos:', error);
    res.status(500).json({ mensaje: 'Error al obtener recursos' });
  }
};


exports.getMisRecursos = async (req, res) => {
  try {
    const recursos = await Recurso.findByUsuario(req.usuario.id);
    res.json(recursos);
  } catch (error) {
    console.error('Error al obtener recursos:', error);
    res.status(500).json({ mensaje: 'Error al obtener recursos' });
  }
};


exports.getRecursoById = async (req, res) => {
  try {
    const recurso = await Recurso.findById(req.params.id);
    
    if (!recurso) {
      return res.status(404).json({ mensaje: 'Recurso no encontrado' });
    }
    
    res.json(recurso);
  } catch (error) {
    console.error('Error al obtener recurso:', error);
    res.status(500).json({ mensaje: 'Error al obtener recurso' });
  }
};


exports.updateRecurso = async (req, res) => {
  try {
    const { titulo, descripcion, categoriaId } = req.body;
    const recursoId = req.params.id;
    
    
    if (!titulo || !descripcion || !categoriaId) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
    
    
    const recurso = await Recurso.findById(recursoId);
    
    if (!recurso) {
      return res.status(404).json({ mensaje: 'Recurso no encontrado' });
    }
    
    if (recurso.usuario_id !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'No tienes permiso para modificar este recurso' });
    }
    
    
    const actualizado = await Recurso.update(recursoId, {
      titulo,
      descripcion,
      categoriaId
    });
    
    if (!actualizado) {
      return res.status(500).json({ mensaje: 'Error al actualizar recurso' });
    }
    
    res.json({ mensaje: 'Recurso actualizado correctamente' });
  } catch (error) {
    console.error('Error al actualizar recurso:', error);
    res.status(500).json({ mensaje: 'Error al actualizar recurso' });
  }
};


exports.deleteRecurso = async (req, res) => {
  try {
    const recursoId = req.params.id;
    
    
    const recurso = await Recurso.findById(recursoId);
    
    if (!recurso) {
      return res.status(404).json({ mensaje: 'Recurso no encontrado' });
    }
    
    if (recurso.usuario_id !== req.usuario.id && req.usuario.rol !== 'admin') {
      return res.status(403).json({ mensaje: 'No tienes permiso para eliminar este recurso' });
    }
    
    
    const filePath = path.join(__dirname, '..', recurso.archivo_url);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    
    
    const eliminado = await Recurso.delete(recursoId);
    
    if (!eliminado) {
      return res.status(500).json({ mensaje: 'Error al eliminar recurso' });
    }
    
    res.json({ mensaje: 'Recurso eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar recurso:', error);
    res.status(500).json({ mensaje: 'Error al eliminar recurso' });
  }
};
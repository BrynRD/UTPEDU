const Recurso = require('../models/Recurso');
const path = require('path');
const fs = require('fs');
const { pool } = require('../config/db');
const GoogleDriveService = require('../services/googleDriveService');
const Categoria = require('../models/Categoria');
const axios = require('axios');

// Ruta base para los archivos subidos
const uploadsDir = path.join(process.cwd(), 'uploads');

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
    
    // Mantener el nombre original del archivo
    const originalName = req.file.originalname;
    
    // Subir archivo a Google Drive
    const driveResponse = await GoogleDriveService.uploadFile(
      req.file,
      originalName
    );
    
    const recursoId = await Recurso.create({
      titulo,
      descripcion,
      archivoUrl: driveResponse.webViewLink,
      archivoId: driveResponse.fileId,
      categoriaId,
      usuarioId,
      tipoArchivo: path.extname(req.file.originalname).substring(1).toUpperCase(),
      descargas: 0
    });
    
    res.status(201).json({
      mensaje: 'Recurso creado correctamente',
      recurso: {
        id: recursoId,
        titulo,
        descripcion,
        archivoUrl: driveResponse.webViewLink,
        archivoId: driveResponse.fileId,
        categoriaId,
        usuarioId,
        tipoArchivo: path.extname(req.file.originalname).substring(1).toUpperCase(),
        descargas: 0
      }
    });
  } catch (error) {
    console.error('Error al crear recurso:', error);
    res.status(500).json({ mensaje: 'Error al crear recurso' });
  }
};

exports.getAllRecursos = async (req, res) => {
  try {
    const { searchTerm = '', page = '1', limit = '7' } = req.query;
    console.log('Received query params:', req.query);
    
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 7);
    const offset = (pageNum - 1) * limitNum;

    console.log('Processed pagination params:', { pageNum, limitNum, offset, searchTerm });

    // Primero obtenemos el total de recursos
    const [totalRecursos] = await pool.query(`
      SELECT COUNT(*) as total
      FROM recursos r
      WHERE r.titulo LIKE ? OR r.descripcion LIKE ?
    `, [`%${searchTerm}%`, `%${searchTerm}%`]);

    const total = totalRecursos[0].total;
    const totalPages = Math.ceil(total / limitNum);

    // Luego obtenemos los recursos paginados
    const [recursos] = await pool.query(`
      SELECT
        r.id,
        r.titulo,
        r.descripcion,
        r.archivo_url,
        r.categoria_id,
        c.nombre AS categoria_nombre,
        r.usuario_id,
        r.fecha_creacion,
        r.tipo_archivo,
        r.descargas
      FROM recursos r
      JOIN categorias c ON r.categoria_id = c.id
      WHERE r.titulo LIKE ? OR r.descripcion LIKE ?
      ORDER BY r.fecha_creacion DESC
      LIMIT ? OFFSET ?
    `, [`%${searchTerm}%`, `%${searchTerm}%`, limitNum, offset]);

    console.log('Query results:', {
      recursosCount: recursos.length,
      total,
      pageNum,
      totalPages,
      limitNum,
      offset,
      firstRecurso: recursos[0]?.titulo,
      lastRecurso: recursos[recursos.length - 1]?.titulo
    });

    res.json({
      recursos,
      totalRecursos: total,
      currentPage: pageNum,
      totalPages
    });
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
    
    // Eliminar archivo de Google Drive
    if (recurso.archivo_id) {
      await GoogleDriveService.deleteFile(recurso.archivo_id);
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

// Controlador para descargar un recurso
exports.downloadRecurso = async (req, res) => {
  console.log('Attempting to download resource. Resource ID:', req.params.id);
  try {
    const recursoId = req.params.id;

    // Buscar el recurso en la base de datos
    console.log('Fetching resource from database with ID:', recursoId);
    const [recursos] = await pool.query(
      'SELECT id, titulo, descripcion, archivo_url, archivo_id, categoria_id, usuario_id, fecha_creacion, tipo_archivo, descargas FROM recursos WHERE id = ?',
      [recursoId]
    );

    if (!recursos || recursos.length === 0) {
      console.log('Resource not found for ID:', recursoId);
      return res.status(404).json({ mensaje: 'Recurso no encontrado' });
    }

    const recurso = recursos[0];
    console.log('Resource found:', recurso.titulo, 'Google Drive File ID:', recurso.archivo_id);

    // Incrementa el contador de descargas
    await pool.query('UPDATE recursos SET descargas = descargas + 1 WHERE id = ?', [recursoId]);
    console.log('Download count incremented for resource ID:', recursoId);

    // Get the webContentLink using the file ID for direct download
    const driveUrls = await GoogleDriveService.getFileUrl(recurso.archivo_id);
    const downloadUrl = driveUrls.webContentLink;

    if (!downloadUrl) {
      console.error('Google Drive webContentLink not available for file ID:', recurso.archivo_id);
      return res.status(500).json({ mensaje: 'No se pudo obtener la URL de descarga directa.' });
    }

    // Use axios to fetch the file content from the webContentLink
    console.log('Attempting to fetch file from URL:', downloadUrl);

    const response = await axios({
      method: 'get',
      url: downloadUrl,
      responseType: 'stream'
    });
    console.log('File fetched successfully from URL.');

    // Limpiar el título para usarlo como nombre de archivo y asegurarse de que no haya espacios extra o guiones bajos al final
    const cleanTitle = recurso.titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase().trim();
    // Obtener la extensión, asegurarse de que no haya espacios extra y convertir a minúsculas
    const fileExtension = recurso.tipo_archivo ? `.${recurso.tipo_archivo.toLowerCase().trim()}` : '';
    const fileName = `${cleanTitle}${fileExtension}`;

    // Set headers for download
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', response.headers['content-type']);
    console.log('Download headers set with filename:', fileName);

    // Pipe the file stream to the response
    response.data.pipe(res);
    console.log('File stream piped to response.');

  } catch (error) {
    console.error('Error al descargar recurso:', error);
    // Check if headers have already been sent
    if (!res.headersSent) {
      res.status(500).json({ mensaje: 'Error al descargar el recurso' });
    } else {
      // If headers were sent, just end the response
      res.end();
    }
  }
};

exports.getEstadisticas = async (req, res) => {
  try {
    const usuarioId = req.usuario.id;

    // Total de recursos
    const totalRecursos = await Recurso.count({
      where: { usuarioId }
    });

    // Total de descargas
    const totalDescargas = await Recurso.sum('descargas', {
      where: { usuarioId }
    });

    // Recursos más descargados
    const recursosPopulares = await Recurso.findAll({
      where: { usuarioId },
      order: [['descargas', 'DESC']],
      limit: 5,
      include: [{
        model: Categoria,
        attributes: ['nombre']
      }]
    });

    res.json({
      totalRecursos,
      totalDescargas: totalDescargas || 0,
      recursosPopulares
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ mensaje: 'Error al obtener estadísticas' });
  }
};
const Recurso = require('../models/Recurso');
const path = require('path');
const fs = require('fs');
const { pool } = require('../config/db');
const Categoria = require('../models/Categoria');
const axios = require('axios');
const recursoService = require('../services/recursoService');
const NextcloudService = require('../services/nextcloudService');

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
    
    let remotePath;
    
    // Modo desarrollo: guardar archivos localmente
    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 MODO DESARROLLO: Guardando archivo localmente en lugar de Google Drive');
      
      // Crear directorio uploads si no existe
      const uploadsDir = path.join(process.cwd(), 'uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      // Generar nombre único para evitar conflictos
      const timestamp = Date.now();
      const fileExtension = path.extname(originalName);
      const fileName = `${timestamp}_${originalName}`;
      const localPath = path.join(uploadsDir, fileName);
      
      // Copiar archivo a directorio uploads
      fs.copyFileSync(req.file.path, localPath);
      
      // Simular respuesta de Google Drive
      remotePath = `http://localhost:3001/uploads/${fileName}`;
    } else {
      // Modo producción: usar Google Drive
      remotePath = await recursoService.subirArchivoRecurso(req.file);
    }
    
    const recursoId = await Recurso.create({
      titulo,
      descripcion,
      archivoUrl: remotePath,
      archivoId: remotePath,
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
        archivoUrl: remotePath,
        archivoId: remotePath,
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
  console.log('BODY:', req.body);
  console.log('FILE:', req.file);
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
    let archivoUrl, archivoId, tipoArchivo;
    if (req.file) {
      // Eliminar archivo anterior si existe (opcional, según tu lógica)
      if (recurso.archivo_id) {
        try {
          await NextcloudService.deleteFile(recurso.archivo_id);
        } catch (err) {
          console.error('Error al eliminar archivo anterior:', err.message || err);
        }
      }
      // Subir nuevo archivo
      if (process.env.NODE_ENV === 'development') {
        // Guardar localmente
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const timestamp = Date.now();
        const fileExtension = path.extname(req.file.originalname);
        const fileName = `${timestamp}_${req.file.originalname}`;
        const localPath = path.join(uploadsDir, fileName);
        fs.writeFileSync(localPath, req.file.buffer);
        archivoUrl = `http://localhost:3001/uploads/${fileName}`;
        archivoId = archivoUrl;
        tipoArchivo = fileExtension.substring(1).toUpperCase();
      } else {
        // Producción: subir a Nextcloud/Google Drive
        archivoUrl = await recursoService.subirArchivoRecurso(req.file);
        archivoId = archivoUrl;
        tipoArchivo = path.extname(req.file.originalname).substring(1).toUpperCase();
      }
    }
    const actualizado = await Recurso.update(recursoId, {
      titulo,
      descripcion,
      categoriaId,
      archivoUrl,
      archivoId,
      tipoArchivo
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
    // Eliminar archivo de Nextcloud
    if (recurso.archivo_id) {
      try {
        await NextcloudService.deleteFile(recurso.archivo_id);
      } catch (err) {
        // Si el archivo no existe o hay error, loguear pero continuar
        console.error('Error al eliminar archivo en Nextcloud:', err.message || err);
      }
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

    try {
      // Descargar archivo directamente usando Google Drive Service
      console.log('Downloading file directly from Google Drive API...');
      const fileBuffer = await recursoService.descargarArchivoRecurso(recurso.archivo_id);
      
      console.log('📄 Downloaded file data:', {
        bufferSize: fileBuffer.length,
        mimeType: 'application/octet-stream',
        fileName: recurso.titulo
      });
      
      // Usar el nombre original del archivo si está disponible
      let fileName = recurso.titulo;
      
      // Limpiar el nombre del archivo para evitar caracteres problemáticos
      fileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
      
      // Asegurar que tenga la extensión correcta
      if (!fileName.includes('.')) {
        const fileExtension = recurso.tipo_archivo ? `.${recurso.tipo_archivo.toLowerCase().trim()}` : '';
        fileName = `${fileName}${fileExtension}`;
      }

      // Determinar el tipo de archivo y headers para vista previa
      let contentType = 'application/octet-stream';
      let disposition = 'attachment';
      const ext = recurso.tipo_archivo ? recurso.tipo_archivo.toLowerCase().trim() : '';
      if (ext === 'pdf') {
        contentType = 'application/pdf';
        disposition = 'inline';
      } else if (["jpg","jpeg","png","gif","bmp","webp"].includes(ext)) {
        contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
        disposition = 'inline';
      } else if (["txt"].includes(ext)) {
        contentType = 'text/plain';
        disposition = 'inline';
      }
      // Set headers for download o vista previa
      res.setHeader('Content-Disposition', `${disposition}; filename="${fileName}"`);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Length', fileBuffer.length);
      res.setHeader('Cache-Control', 'no-cache');
      
      console.log('Download headers set with filename:', fileName);
      console.log('Content-Type:', contentType);
      console.log('Content-Length:', fileBuffer.length);

      // Send the file buffer directly
      res.send(fileBuffer);
      console.log('File sent successfully.');

    } catch (driveError) {
      console.error('Error downloading from Google Drive API:', driveError);
      return res.status(500).json({ mensaje: 'Error al descargar el archivo desde Google Drive' });
    }

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

// NUEVO: Endpoint público para estudiantes (sin autenticación)
exports.getRecursosPublicos = async (req, res) => {
  console.log('🚀 Backend Public: Function getRecursosPublicos called!');
  console.log('� Request method:', req.method);
  console.log('� Request path:', req.path);
  console.log('🚀 Request query:', req.query);
  
  try {
    const { searchTerm = '', page = '1', limit = '7' } = req.query;
    console.log('Received query params:', req.query);
    
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.max(1, parseInt(limit) || 7);
    const offset = (pageNum - 1) * limitNum;

    console.log('Processed pagination params:', { pageNum, limitNum, offset, searchTerm });

    // Primero obtenemos el total de recursos públicos
    const [totalRecursos] = await pool.query(`
      SELECT COUNT(*) as total
      FROM recursos r
      WHERE (r.titulo LIKE ? OR r.descripcion LIKE ?)
      AND r.archivo_id IS NOT NULL
    `, [`%${searchTerm}%`, `%${searchTerm}%`]);

    const total = totalRecursos[0].total;
    const totalPages = Math.ceil(total / limitNum);

    // Luego obtenemos los recursos paginados con información completa
    const [recursos] = await pool.query(`
      SELECT
        r.id,
        r.titulo,
        r.descripcion,
        r.archivo_url,
        r.archivo_id,
        r.categoria_id,
        c.nombre AS categoria_nombre,
        r.usuario_id,
        u.nombre AS profesor_nombre,
        u.apellido AS profesor_apellido,
        r.fecha_creacion,
        r.tipo_archivo,
        r.descargas
      FROM recursos r
      JOIN categorias c ON r.categoria_id = c.id
      JOIN usuarios u ON r.usuario_id = u.id
      WHERE (r.titulo LIKE ? OR r.descripcion LIKE ?)
      AND r.archivo_id IS NOT NULL
      ORDER BY r.fecha_creacion DESC
      LIMIT ? OFFSET ?
    `, [`%${searchTerm}%`, `%${searchTerm}%`, limitNum, offset]);

    console.log('Public query results:', {
      recursosCount: recursos.length,
      total,
      pageNum,
      totalPages,
      limitNum,
      offset,
      firstRecurso: recursos[0]?.titulo,
      lastRecurso: recursos[recursos.length - 1]?.titulo
    });

    // Formatear la respuesta con información adicional para el frontend
    const recursosFormateados = recursos.map(recurso => ({
      id: recurso.id,
      titulo: recurso.titulo,
      descripcion: recurso.descripcion,
      archivoUrl: recurso.archivo_url,
      archivoId: recurso.archivo_id,
      categoriaId: recurso.categoria_id,
      categoriaNombre: recurso.categoria_nombre,
      usuarioId: recurso.usuario_id,
      profesorNombre: `${recurso.profesor_nombre} ${recurso.profesor_apellido}`,
      fechaCreacion: recurso.fecha_creacion,
      tipoArchivo: recurso.tipo_archivo,
      descargas: recurso.descargas
    }));

    res.json({
      recursos: recursosFormateados,
      totalRecursos: total,
      currentPage: pageNum,
      totalPages,
      mensaje: `${total} recursos encontrados`
    });
  } catch (error) {
    console.error('❌ Error en getRecursosPublicos:', error);
    res.status(500).json({ 
      mensaje: 'Error en endpoint público',
      error: error.message 
    });
  }
};
const { pool } = require('../config/db');

class Recurso {

  static async create({ titulo, descripcion, archivoUrl, archivoId, categoriaId, usuarioId, tipoArchivo, descargas }) {
    const [result] = await pool.query(
      'INSERT INTO recursos (titulo, descripcion, archivo_url, archivo_id, categoria_id, usuario_id, tipo_archivo, descargas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [titulo, descripcion, archivoUrl, archivoId, categoriaId, usuarioId, tipoArchivo, descargas]
    );
    
    return result.insertId;
  }

  static async findAll() {
    const [recursos] = await pool.query(
      `SELECT r.*, c.nombre as categoria, CONCAT(u.nombre, ' ', u.apellido) as autor 
       FROM recursos r 
       JOIN categorias c ON r.categoria_id = c.id 
       JOIN usuarios u ON r.usuario_id = u.id 
       ORDER BY r.fecha_creacion DESC`
    );
    return recursos;
  }

 
  static async findByUsuario(usuarioId) {
    const [recursos] = await pool.query(`
      SELECT 
        r.*,
        c.nombre as categoria_nombre
       FROM recursos r 
       JOIN categorias c ON r.categoria_id = c.id 
       WHERE r.usuario_id = ? 
      ORDER BY r.fecha_creacion DESC
    `, [usuarioId]);
    return recursos;
  }

  
  static async findById(id) {
    const [recursos] = await pool.query(`
      SELECT 
        r.*,
        c.nombre as categoria_nombre
       FROM recursos r 
       JOIN categorias c ON r.categoria_id = c.id 
      WHERE r.id = ?
    `, [id]);
    return recursos[0];
  }

  
  static async update(id, { titulo, descripcion, categoriaId, archivoUrl, archivoId, tipoArchivo }) {
    // Construir la consulta dinámicamente según los campos presentes
    let query = 'UPDATE recursos SET titulo = ?, descripcion = ?, categoria_id = ?';
    let params = [titulo, descripcion, categoriaId];
    if (archivoUrl) {
      query += ', archivo_url = ?';
      params.push(archivoUrl);
    }
    if (archivoId) {
      query += ', archivo_id = ?';
      params.push(archivoId);
    }
    if (tipoArchivo) {
      query += ', tipo_archivo = ?';
      params.push(tipoArchivo);
    }
    query += ' WHERE id = ?';
    params.push(id);
    const [result] = await pool.query(query, params);
    return result.affectedRows > 0;
  }

 
  static async delete(id) {
    const [result] = await pool.query('DELETE FROM recursos WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Recurso;
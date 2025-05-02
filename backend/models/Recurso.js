const { pool } = require('../config/db');

class Recurso {

  static async create(recursoData) {
    const { titulo, descripcion, archivoUrl, categoriaId, usuarioId } = recursoData;
    
    const [result] = await pool.query(
      'INSERT INTO recursos (titulo, descripcion, archivo_url, categoria_id, usuario_id) VALUES (?, ?, ?, ?, ?)',
      [titulo, descripcion, archivoUrl, categoriaId, usuarioId]
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
    const [recursos] = await pool.query(
      `SELECT r.*, c.nombre as categoria 
       FROM recursos r 
       JOIN categorias c ON r.categoria_id = c.id 
       WHERE r.usuario_id = ? 
       ORDER BY r.fecha_creacion DESC`,
      [usuarioId]
    );
    return recursos;
  }

  
  static async findById(id) {
    const [recursos] = await pool.query(
      `SELECT r.*, c.nombre as categoria, CONCAT(u.nombre, ' ', u.apellido) as autor 
       FROM recursos r 
       JOIN categorias c ON r.categoria_id = c.id 
       JOIN usuarios u ON r.usuario_id = u.id 
       WHERE r.id = ?`,
      [id]
    );
    return recursos.length ? recursos[0] : null;
  }

  
  static async update(id, recursoData) {
    const { titulo, descripcion, categoriaId } = recursoData;
    
    const [result] = await pool.query(
      'UPDATE recursos SET titulo = ?, descripcion = ?, categoria_id = ? WHERE id = ?',
      [titulo, descripcion, categoriaId, id]
    );
    
    return result.affectedRows > 0;
  }

 
  static async delete(id) {
    const [result] = await pool.query('DELETE FROM recursos WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Recurso;
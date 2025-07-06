const { pool } = require('../config/db');

class Incidencia {
  constructor(incidencia) {
    this.id = incidencia.id;
    this.nombre = incidencia.nombre;
    this.email = incidencia.email;
    this.asunto = incidencia.asunto;
    this.descripcion = incidencia.descripcion;
    this.estado = incidencia.estado || 'pendiente';
    this.fecha = incidencia.fecha;
    this.imagenUrl = incidencia.imagenUrl;
    this.usuario_id = incidencia.usuario_id;
  }

  static async create(incidenciaData) {
    const query = `
      INSERT INTO incidencias (nombre, email, asunto, descripcion, estado, imagenUrl, usuario_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      incidenciaData.nombre,
      incidenciaData.email,
      incidenciaData.asunto,
      incidenciaData.descripcion,
      incidenciaData.estado || 'pendiente',
      incidenciaData.imagenUrl || null,
      incidenciaData.usuario_id || null
    ];

    try {
      const [result] = await pool.execute(query, values);
      return result.insertId;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    const query = `
      SELECT * FROM incidencias 
      WHERE email = ? 
      ORDER BY fecha DESC
    `;
    
    try {
      const [rows] = await pool.execute(query, [email]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    const query = `
      SELECT * FROM incidencias 
      ORDER BY fecha DESC
    `;
    
    try {
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    const query = `
      SELECT * FROM incidencias 
      WHERE id = ?
    `;
    
    try {
      const [rows] = await pool.execute(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }

  static async updateEstado(id, estado) {
    const query = `
      UPDATE incidencias 
      SET estado = ? 
      WHERE id = ?
    `;
    
    try {
      const [result] = await pool.execute(query, [estado, id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async update(id, incidenciaData) {
    const query = `
      UPDATE incidencias 
      SET nombre = ?, email = ?, asunto = ?, descripcion = ?, estado = ?, imagenUrl = ?
      WHERE id = ?
    `;
    
    const values = [
      incidenciaData.nombre,
      incidenciaData.email,
      incidenciaData.asunto,
      incidenciaData.descripcion,
      incidenciaData.estado,
      incidenciaData.imagenUrl,
      id
    ];

    try {
      const [result] = await pool.execute(query, values);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    const query = `
      DELETE FROM incidencias 
      WHERE id = ?
    `;
    
    try {
      const [result] = await pool.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async getStats() {
    const query = `
      SELECT 
        estado,
        COUNT(*) as cantidad
      FROM incidencias 
      GROUP BY estado
    `;
    
    try {
      const [rows] = await pool.execute(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async findByUsuarioId(usuario_id) {
    const query = `
      SELECT * FROM incidencias
      WHERE usuario_id = ?
      ORDER BY fecha DESC
    `;
    const [rows] = await pool.execute(query, [usuario_id]);
    return rows;
  }

  static async findAllWithUsuario() {
    const query = `
      SELECT i.*, u.codigo_institucional, u.email AS email_institucional, u.nombre AS nombre_usuario, u.apellido AS apellido_usuario
      FROM incidencias i
      LEFT JOIN usuarios u ON i.usuario_id = u.id
      ORDER BY i.fecha DESC
    `;
    const [rows] = await pool.execute(query);
    return rows;
  }

  /**
   * Busca incidencias con JOIN usuario, paginación y filtros
   * @param {Object} params - { page, limit, estado, usuario_id, fecha_inicio, fecha_fin }
   * @returns {Object} { rows, total }
   */
  static async findAllWithUsuarioPaginado(params = {}) {
    const {
      page = 1,
      limit = 20,
      estado,
      usuario_id,
      fecha_inicio,
      fecha_fin
    } = params;
    const offset = (page - 1) * limit;
    let where = [];
    let values = [];

    if (estado) {
      where.push('i.estado = ?');
      values.push(estado);
    }
    if (usuario_id) {
      where.push('i.usuario_id = ?');
      values.push(usuario_id);
    }
    if (fecha_inicio) {
      where.push('i.fecha >= ?');
      values.push(fecha_inicio);
    }
    if (fecha_fin) {
      where.push('i.fecha <= ?');
      values.push(fecha_fin);
    }
    const whereClause = where.length ? 'WHERE ' + where.join(' AND ') : '';

    // Query de datos paginados
    const query = `
      SELECT i.*, u.codigo_institucional, u.email AS email_institucional, u.nombre AS nombre_usuario, u.apellido AS apellido_usuario
      FROM incidencias i
      LEFT JOIN usuarios u ON i.usuario_id = u.id
      ${whereClause}
      ORDER BY i.fecha DESC
      LIMIT ? OFFSET ?
    `;
    // Query de total
    const countQuery = `
      SELECT COUNT(*) as total
      FROM incidencias i
      LEFT JOIN usuarios u ON i.usuario_id = u.id
      ${whereClause}
    `;
    try {
      const [countRows] = await pool.execute(countQuery, values);
      const total = countRows[0]?.total || 0;
      const [rows] = await pool.execute(query, [...values, Number(limit), Number(offset)]);
      return { rows, total };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Incidencia; 
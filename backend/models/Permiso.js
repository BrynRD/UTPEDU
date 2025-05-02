const { pool } = require('../config/db');

class Permiso {
  static async findByUsuarioId(userId) {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM permisos WHERE usuario_id = ?', 
        [userId]
      );
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error al obtener permisos:', error);
      return null;
    }
  }
  
  static async createOrUpdate(userId, permisos) {
    try {
      const { crear_recursos, editar_recursos, eliminar_recursos,
              gestionar_usuarios, ver_estadisticas, administrar_sistema } = permisos;
      
      // Verificar si ya existen permisos para este usuario
      const existingPermisos = await this.findByUsuarioId(userId);
      
      if (existingPermisos) {
        // Actualizar permisos existentes
        const [result] = await pool.query(
          `UPDATE permisos SET 
            crear_recursos = ?, 
            editar_recursos = ?, 
            eliminar_recursos = ?,
            gestionar_usuarios = ?,
            ver_estadisticas = ?,
            administrar_sistema = ?
           WHERE usuario_id = ?`,
          [
            crear_recursos ? 1 : 0, 
            editar_recursos ? 1 : 0, 
            eliminar_recursos ? 1 : 0,
            gestionar_usuarios ? 1 : 0,
            ver_estadisticas ? 1 : 0,
            administrar_sistema ? 1 : 0,
            userId
          ]
        );
        
        return result.affectedRows > 0;
      } else {
        // Crear nuevos permisos
        const [result] = await pool.query(
          `INSERT INTO permisos (
            usuario_id, crear_recursos, editar_recursos, eliminar_recursos,
            gestionar_usuarios, ver_estadisticas, administrar_sistema
          ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            userId, 
            crear_recursos ? 1 : 0, 
            editar_recursos ? 1 : 0, 
            eliminar_recursos ? 1 : 0,
            gestionar_usuarios ? 1 : 0,
            ver_estadisticas ? 1 : 0,
            administrar_sistema ? 1 : 0
          ]
        );
        
        return result.insertId > 0;
      }
    } catch (error) {
      console.error('Error al actualizar permisos:', error);
      return false;
    }
  }
  
  // Verificar si un usuario tiene un permiso específico
  static async checkPermission(userId, permission) {
    try {
      const permisos = await this.findByUsuarioId(userId);
      
      if (!permisos) return false;
      
      return permisos[permission] === 1;
    } catch (error) {
      console.error('Error al verificar permiso:', error);
      return false;
    }
  }
}

module.exports = Permiso;
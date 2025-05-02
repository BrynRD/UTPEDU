const { pool } = require('../config/db');
const bcrypt = require('bcrypt');

class Usuario {
  // ELIMINAR este findByEmail duplicado
  
  static async findByEmail(email) {
    try {
      console.log(`Buscando usuario por email: ${email}`);
      
      // Modifica la consulta para obtener el nombre del rol junto con los datos del usuario
      const [rows] = await pool.query(`
        SELECT u.*, r.nombre as rol 
        FROM usuarios u 
        LEFT JOIN roles r ON u.rol_id = r.id 
        WHERE LOWER(u.email) = LOWER(?)
      `, [email]);
      
      // Log para depurar
      if (rows.length > 0) {
        console.log('Usuario encontrado:', { 
          id: rows[0].id, 
          email: rows[0].email, 
          rol_id: rows[0].rol_id,
          rol: rows[0].rol,
          password_hash: rows[0].password ? rows[0].password.substring(0, 10) + '...' : 'no disponible'
        });
      } else {
        console.log('Usuario no encontrado para email:', email);
      }
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      console.error('Error al buscar usuario por email:', error);
      return null;
    }
  }


  static async findById(id) {
    const [rows] = await pool.query(`
      SELECT u.*, r.nombre as rol 
      FROM usuarios u 
      JOIN roles r ON u.rol_id = r.id 
      WHERE u.id = ?
    `, [id]);
    return rows.length > 0 ? rows[0] : null;
  }
  static async findAll() {
    try {
      // Añade logs para entender qué está sucediendo
      console.log('Consultando todos los usuarios con sus roles...');
      
      const [usuarios] = await pool.query(`
        SELECT u.id, u.nombre, u.apellido, u.email, u.institucion, 
               u.nivel_educativo, u.area_especialidad, r.nombre as rol, 
               u.fecha_registro, u.codigo_institucional, u.activo,
               u.rol_id  -- Añadir rol_id para depuración
        FROM usuarios u 
        JOIN roles r ON u.rol_id = r.id
      `);
      
      console.log('Roles encontrados:', usuarios.map(u => ({id: u.id, nombre: u.nombre, rol: u.rol, rol_id: u.rol_id})));
      
      return usuarios;
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error);
      return [];
    }
  }
  static async create(userData) {
    const { nombre, apellido, email, password, rolId, codigoInstitucional, institucion, nivelEducativo, areaEspecialidad } = userData;
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await pool.query(
      `INSERT INTO usuarios (nombre, apellido, email, password, rol_id, codigo_institucional, 
                           institucion, nivel_educativo, area_especialidad, activo) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)`,
      [nombre, apellido, email, hashedPassword, rolId, codigoInstitucional, institucion, nivelEducativo, areaEspecialidad]
    );
    
    return result.insertId;
  }

  // Modificar el método updateProfile
static async updateProfile(id, userData) {
  try {
    const { nombre, apellido, email, institucion, nivelEducativo, areaEspecialidad, telefono, biografia } = userData;
    
    console.log('Actualizando perfil con datos:', {
      id, nombre, apellido, email, institucion, 
      nivelEducativo, areaEspecialidad, telefono, biografia
    });
    
    const [result] = await pool.query(
      `UPDATE usuarios SET 
        nombre = ?, 
        apellido = ?, 
        institucion = ?,
        nivel_educativo = ?,
        area_especialidad = ?,
        telefono = ?,
        biografia = ?
       WHERE id = ?`,
      [nombre, apellido, institucion, nivelEducativo, areaEspecialidad, telefono, biografia, id]
    );
    
    console.log('Resultado de actualización:', result);
    return result.affectedRows > 0;
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    return false;
  }
}

  static async updateRol(id, rolNombre) {
    try {
      // Mostrar lo que estamos buscando para depurar
      console.log('Buscando rol:', rolNombre);
      
      // Consulta insensible a mayúsculas/minúsculas
      const [roles] = await pool.query('SELECT id FROM roles WHERE LOWER(nombre) = LOWER(?)', [rolNombre]);
      
      if (roles.length === 0) {
        console.error('No se encontró el rol:', rolNombre);
        // Obtener todos los roles para ver qué hay disponible
        const [todosRoles] = await pool.query('SELECT id, nombre FROM roles');
        console.log('Roles disponibles:', todosRoles);
        throw new Error(`Rol "${rolNombre}" no encontrado`);
      }
      
      console.log('Rol encontrado con ID:', roles[0].id);
      const rolId = roles[0].id;
      
      // Actualizar el rol del usuario
      const [result] = await pool.query(
        'UPDATE usuarios SET rol_id = ? WHERE id = ?',
        [rolId, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error al actualizar rol:', error);
      return false;
    }
  }

  static async updateActivo(id, activo) {
    try {
      const [result] = await pool.query(
        'UPDATE usuarios SET activo = ? WHERE id = ?',
        [activo ? 1 : 0, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error al actualizar estado activo:', error);
      return false;
    }
  }
  
  static async updatePassword(id, newPassword) {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      const [result] = await pool.query(
        'UPDATE usuarios SET password = ? WHERE id = ?',
        [hashedPassword, id]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error al actualizar contraseña:', error);
      return false;
    }
  }

  static async validatePassword(email, password) {
    try {
      const user = await this.findByEmail(email);
      if (!user) return false;
      
      const match = await bcrypt.compare(password, user.password);
      return match;
    } catch (error) {
      console.error('Error al validar contraseña:', error);
      return false;
    }
  }
}

module.exports = Usuario;
const Usuario = require('../models/Usuario');
const Permiso = require('../models/Permiso');
const Recurso = require('../models/Recurso');
const { pool } = require('../config/db');

exports.getUsuarios = async (req, res) => {
    try {
      // Read pagination parameters from query string
      const page = parseInt(req.query.page) || 1; // Default to page 1
      const limit = parseInt(req.query.limit) || 15; // Default to 15 users per page
      const offset = (page - 1) * limit;

      console.log(`Consultando usuarios con paginación: página ${page}, límite ${limit}, offset ${offset}`);

      // Get paginated users
      const usuarios = await Usuario.findAll(limit, offset);

      // Get total number of users (for pagination info)
      const [totalUsersResult] = await pool.query('SELECT COUNT(*) as total FROM usuarios');
      const totalUsuarios = totalUsersResult[0].total;

      console.log('Total usuarios encontrados (sin paginación):', totalUsuarios);

      // console.log('Usuarios encontrados con roles:', usuarios.map(u => ({id: u.id, nombre: u.nombre, rol: u.rol})));

      res.status(200).json({
        usuarios: usuarios.map(usuario => ({
          id: usuario.id,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          email: usuario.email,
          rol: usuario.rol,  
          codigo_institucional: usuario.codigo_institucional || '',
          createdAt: usuario.fecha_registro,
          activo: usuario.activo === 1
        }))
      });
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      res.status(500).json({ error: 'Error al obtener la lista de usuarios' });
    }
  };
  

exports.getUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    
    const formattedUsuario = {
      id: usuario.id,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      email: usuario.email,
      rol: usuario.rol,
      codigo_institucional: usuario.codigo_institucional || '',
      institucion: usuario.institucion,
      areaEspecialidad: usuario.area_especialidad,
      createdAt: usuario.fecha_registro,
      activo: usuario.activo === 1
    };
    
    res.status(200).json({ usuario: formattedUsuario });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al cargar el usuario' });
  }
};


exports.updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, rol, activo } = req.body;
    
    
    const existingUser = await Usuario.findById(id);
    if (!existingUser) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    
    if (rol && rol !== existingUser.rol) {
      
      await Usuario.updateRol(id, rol);
    }
    
    
    if (activo !== undefined) {
      await Usuario.updateActivo(id, activo);
    }
    
    
    await Usuario.updateProfile(id, {
      nombre, 
      apellido,
      email,
      institucion: existingUser.institucion,
      nivelEducativo: existingUser.nivel_educativo,
      areaEspecialidad: existingUser.area_especialidad
    });
    
    
    const usuarioActualizado = await Usuario.findById(id);
    
    res.status(200).json({
      success: true,
      usuario: {
        id: usuarioActualizado.id,
        nombre: usuarioActualizado.nombre,
        apellido: usuarioActualizado.apellido,
        email: usuarioActualizado.email,
        rol: usuarioActualizado.rol,
        codigo_institucional: usuarioActualizado.codigo_institucional || '',
        createdAt: usuarioActualizado.fecha_registro,
        activo: usuarioActualizado.activo === 1
      }
    });
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    res.status(500).json({ error: 'Error al actualizar el usuario' });
  }
};




exports.toggleUsuarioActivo = async (req, res) => {
    try {
      const { id } = req.params;
      const { activo } = req.body;
      
      
      const existingUser = await Usuario.findById(id);
      if (!existingUser) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      
      
      const updated = await Usuario.updateActivo(id, activo);
      
      if (updated) {
        
        const usuarioActualizado = await Usuario.findById(id);
        
        return res.status(200).json({
          success: true,
          message: `Usuario ${activo ? 'activado' : 'desactivado'} correctamente`,
          usuario: {
            id: usuarioActualizado.id,
            nombre: usuarioActualizado.nombre,
            apellido: usuarioActualizado.apellido,
            email: usuarioActualizado.email,
            rol: usuarioActualizado.rol,
            codigo_institucional: usuarioActualizado.codigo_institucional || '',
            createdAt: usuarioActualizado.fecha_registro,
            activo: usuarioActualizado.activo === 1
          }
        });
      } else {
        return res.status(500).json({ 
          success: false, 
          error: `No se pudo ${activo ? 'activar' : 'desactivar'} el usuario` 
        });
      }
    } catch (error) {
      console.error(`Error al ${req.body.activo ? 'activar' : 'desactivar'} usuario:`, error);
      res.status(500).json({ 
        success: false, 
        error: 'Error interno del servidor' 
      });
    }
  };


exports.getPermisos = async (req, res) => {
  try {
    const { id } = req.params;
    
    
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    
    const permisos = await Permiso.findByUsuarioId(id);
    
    if (!permisos) {
      
      const permisosDefault = {
        crearRecursos: usuario.rol !== 'estudiante',
        editarRecursos: usuario.rol !== 'estudiante',
        eliminarRecursos: usuario.rol === 'admin',
        gestionarUsuarios: usuario.rol === 'admin',
        verEstadisticas: usuario.rol === 'admin',
        administrarSistema: usuario.rol === 'admin'
      };
      
      return res.status(200).json({ permisos: permisosDefault });
    }
    
    
    res.status(200).json({
      permisos: {
        crearRecursos: permisos.crear_recursos === 1,
        editarRecursos: permisos.editar_recursos === 1,
        eliminarRecursos: permisos.eliminar_recursos === 1,
        gestionarUsuarios: permisos.gestionar_usuarios === 1,
        verEstadisticas: permisos.ver_estadisticas === 1,
        administrarSistema: permisos.administrar_sistema === 1
      }
    });
  } catch (error) {
    console.error('Error al obtener permisos:', error);
    res.status(500).json({ error: 'Error al cargar los permisos' });
  }
};


exports.updatePermisos = async (req, res) => {
  try {
    const { id } = req.params;
    const { permisos } = req.body;
    
    if (!permisos) {
      return res.status(400).json({ error: 'No se proporcionaron permisos' });
    }
    
    
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    
    await Permiso.createOrUpdate(id, {
      crear_recursos: permisos.crearRecursos,
      editar_recursos: permisos.editarRecursos,
      eliminar_recursos: permisos.eliminarRecursos,
      gestionar_usuarios: permisos.gestionarUsuarios,
      ver_estadisticas: permisos.verEstadisticas,
      administrar_sistema: permisos.administrarSistema
    });
    
    res.status(200).json({
      success: true,
      mensaje: 'Permisos actualizados con éxito'
    });
  } catch (error) {
    console.error('Error al actualizar permisos:', error);
    res.status(500).json({ error: 'Error al actualizar los permisos' });
  }
};


exports.getEstadisticas = async (req, res) => {
  try {
    
    

    
    const [totalUsuariosResult] = await pool.query('SELECT COUNT(*) as total FROM usuarios');
    const totalUsuarios = totalUsuariosResult[0].total;
    
    
    const [usuariosNuevosMesResult] = await pool.query(
      'SELECT COUNT(*) as total FROM usuarios WHERE fecha_registro >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH)'
    );
    const usuariosNuevosMes = usuariosNuevosMesResult[0].total;
    
    
    
    res.status(200).json({
      estadisticas: {
        totalUsuarios,
        usuariosNuevosMes,
        
        totalRecursos: 0, 
        recursosNuevosMes: 0, 
        totalDescargas: 0, 
        descargasSemanales: 0, 
        nuevosRegistros: usuariosNuevosMes,
        nuevosRegistrosSemanales: 0 
      }
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al cargar las estadísticas' });
  }
};


exports.getRecursosPopulares = async (req, res) => {
  try {
    
    const recursos = [
      {
        id: 1,
        titulo: "Introducción a la Programación",
        descargas: 120,
        categoria: "Informática",
        autor: {
          id: 5,
          nombre: "Carlos",
          apellido: "Rodríguez"
        }
      }
    ];
    
    res.status(200).json({ recursos });
  } catch (error) {
    console.error('Error al obtener recursos populares:', error);
    res.status(500).json({ error: 'Error al cargar los recursos populares' });
  }
};

exports.changeUserPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: 'La nueva contraseña es requerida.' });
    }

    // Optional: Add more password validation logic here if needed

    const success = await Usuario.updatePassword(id, newPassword);

    if (success) {
      res.status(200).json({ message: 'Contraseña de usuario actualizada con éxito.' });
    } else {
      // This might happen if the user ID is not found by updatePassword
      res.status(404).json({ error: 'Usuario no encontrado o contraseña no actualizada.' });
    }

  } catch (error) {
    console.error('Error al cambiar la contraseña del usuario por el administrador:', error);
    res.status(500).json({ error: 'Error interno del servidor al cambiar la contraseña.' });
  }
};

exports.createUsuario = async (req, res) => {
  try {
    const { nombre, apellido, email, password, rol, codigo_institucional, institucion, areaEspecialidad } = req.body;

    // Basic validation
    if (!nombre || !apellido || !email || !password || !rol || !codigo_institucional || !institucion || !areaEspecialidad) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (nombre, apellido, email, password, rol, codigo_institucional, institucion, areaEspecialidad).' });
    }

    // Optional: Validate email format, password strength, etc.
    // Optional: Check if email already exists
    const existingUser = await Usuario.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya está registrado.' });
    }

    // Find the role ID based on the role name provided
    const [roles] = await pool.query('SELECT id FROM roles WHERE LOWER(nombre) = LOWER(?)', [rol]);
    if (roles.length === 0) {
        return res.status(400).json({ error: 'Rol especificado no válido.' });
    }
    const rolId = roles[0].id;


    const newUserId = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      rolId,
      codigo_institucional,
      institucion,
      areaEspecialidad: areaEspecialidad,
    });

    // Optionally fetch the created user to return it in the response
    const createdUser = await Usuario.findById(newUserId);

    res.status(201).json({
      message: 'Usuario creado con éxito.',
      usuario: createdUser // Return created user data (excluding password hash)
    });

  } catch (error) {
    console.error('Error al crear usuario por el administrador:', error);
    res.status(500).json({ error: error.message || 'Error interno del servidor al crear el usuario.' });
  }
};

// Add Delete User Controller Function
exports.deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params; // Get user ID from route parameters
    console.log('Solicitud para eliminar usuario con ID:', id);

    // Optional: Add authorization check here to ensure only admins can delete
    // if (req.usuario.rol !== 'admin') { /* return unauthorized error */ }

    const success = await Usuario.delete(id);

    if (success) {
      res.status(200).json({ success: true, message: 'Usuario eliminado con éxito.' });
    } else {
      // This might happen if the user ID was not found
      res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
    }

  } catch (error) {
    console.error('Error al eliminar usuario por el administrador:', error);
    res.status(500).json({ success: false, error: error.message || 'Error interno del servidor al eliminar el usuario.' });
  }
};
const Usuario = require('../models/Usuario');
const Permiso = require('../models/Permiso');
const Recurso = require('../models/Recurso');
const { pool } = require('../config/db');

exports.getUsuarios = async (req, res) => {
    try {
      const usuarios = await Usuario.findAll();
      
      
      console.log('Usuarios encontrados con roles:', usuarios.map(u => ({id: u.id, nombre: u.nombre, rol: u.rol})));
      
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
      nivelEducativo: usuario.nivel_educativo,
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
      },
      {
        id: 2,
        titulo: "Fundamentos de Matemáticas",
        descargas: 95,
        categoria: "Matemáticas",
        autor: {
          id: 3,
          nombre: "Ana",
          apellido: "García"
        }
      },
      {
        id: 3,
        titulo: "Historia del Arte",
        descargas: 87,
        categoria: "Humanidades",
        autor: {
          id: 7,
          nombre: "Laura",
          apellido: "Martínez"
        }
      }
    ];
    
    res.status(200).json({ recursos });
  } catch (error) {
    console.error('Error al obtener recursos populares:', error);
    res.status(500).json({ error: 'Error al cargar los recursos populares' });
  }
};
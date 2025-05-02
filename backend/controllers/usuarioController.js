const Usuario = require('../models/Usuario');


exports.getPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id);
    
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({ mensaje: 'Error al obtener perfil' });
  }
};


exports.updatePerfil = async (req, res) => {
  try {
    const { nombre, apellido, area_especialidad, telefono, biografia } = req.body;
    
    
    if (!nombre || !apellido) {
      return res.status(400).json({ mensaje: 'Nombre y apellido son obligatorios' });
    }
    
    
    const usuarioActual = await Usuario.findById(req.usuario.id);
    
    
    const actualizado = await Usuario.updateProfile(req.usuario.id, {
      nombre,
      apellido,
      email: usuarioActual.email, 
      institucion: usuarioActual.institucion || 'Universidad Tecnológica del Perú',
      nivelEducativo: req.body.nivel_educativo || usuarioActual.nivel_educativo || '',
      areaEspecialidad: area_especialidad || usuarioActual.area_especialidad || '',
      telefono: telefono || usuarioActual.telefono || '',
      biografia: biografia || usuarioActual.biografia || ''
    });
    
    if (!actualizado) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }
    
    
    const usuarioActualizado = await Usuario.findById(req.usuario.id);
    
    res.json({ 
      mensaje: 'Perfil actualizado correctamente',
      usuario: usuarioActualizado
    });
  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({ mensaje: 'Error al actualizar perfil' });
  }
};


exports.cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNuevo, confirmarPassword } = req.body;
    
    
    if (!passwordActual || !passwordNuevo || !confirmarPassword) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
    
    if (passwordNuevo !== confirmarPassword) {
      return res.status(400).json({ mensaje: 'Las contraseñas nuevas no coinciden' });
    }
    
    
    const usuario = await Usuario.findById(req.usuario.id);
    const passwordValido = await Usuario.validatePassword(usuario.email, passwordActual);
    
    if (!passwordValido) {
      return res.status(400).json({ mensaje: 'La contraseña actual es incorrecta' });
    }
    
    
    const actualizado = await Usuario.updatePassword(req.usuario.id, passwordNuevo);
    
    if (!actualizado) {
      return res.status(500).json({ mensaje: 'Error al actualizar contraseña' });
    }
    
    res.json({ mensaje: 'Contraseña actualizada correctamente' });
  } catch (error) {
    console.error('Error al cambiar contraseña:', error);
    res.status(500).json({ mensaje: 'Error al cambiar contraseña' });
  }
};

exports.getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll();
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
};
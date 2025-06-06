const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Usuario = require('../models/Usuario');
const { pool } = require('../config/db'); 


exports.registro = async (req, res) => {
  try {
    const { nombre, apellido, email, password, institucion, areaEspecialidad, tipoUsuario } = req.body;
    
    
    if (!nombre || !apellido || !email || !password || !institucion || !areaEspecialidad) {
      return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
    }
    
    
    const usuarioExistente = await Usuario.findByEmail(email);
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'El email ya está registrado' });
    }
    
    
    
    const rolNombre = tipoUsuario && ['admin', 'docente', 'estudiante'].includes(tipoUsuario.toLowerCase()) 
      ? tipoUsuario.toLowerCase() 
      : 'estudiante';
      
    console.log(`Registrando usuario con rol: ${rolNombre}`);
    
    
    const [roles] = await pool.query('SELECT id FROM roles WHERE LOWER(nombre) = LOWER(?)', [rolNombre]);
    
    if (roles.length === 0) {
      console.error(`No se encontró el rol "${rolNombre}" en la base de datos`);
      return res.status(500).json({ mensaje: 'Error al asignar rol' });
    }
    
    const rolId = roles[0].id;
    console.log(`Usando rol_id: ${rolId} para el nuevo usuario`);
    
    
    const usuarioId = await Usuario.create({
      nombre,
      apellido,
      email,
      password,
      rolId, 
      codigoInstitucional: email.split('@')[0], 
      institucion,
      areaEspecialidad
    });
    
    
    const usuario = await Usuario.findById(usuarioId);
    
    
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: rolNombre }, 
      process.env.JWT_SECRET || 'secreto_jwt',
      { expiresIn: '24h' }
    );
    
    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        rol: rolNombre 
      }
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).json({ mensaje: 'Error al registrar usuario' });
  }
};


exports.login = async (req, res) => {
  try {
    
    if (!req.body) {
      console.log('Error: req.body es undefined');
      return res.status(400).json({ mensaje: 'Datos de solicitud vacíos' });
    }
    
    console.log('Datos recibidos en login:', req.body);
    
    
    const { email, codigoInstitucional, password } = req.body;
    
    
    const identifier = email || codigoInstitucional;
    
    if (!identifier || !password) {
      return res.status(400).json({ 
        mensaje: 'Por favor proporcione su código institucional o email y contraseña' 
      });
    }
    
    console.log(`Intento de login para: ${identifier}`);
    
    
    let usuario = await Usuario.findByEmail(identifier);
    
    
    if (!usuario) {
      
      const [rows] = await pool.query(`
        SELECT u.*, r.nombre as rol 
        FROM usuarios u 
        LEFT JOIN roles r ON u.rol_id = r.id 
        WHERE LOWER(u.codigo_institucional) = LOWER(?)
      `, [identifier]);
      
      usuario = rows.length > 0 ? rows[0] : null;
    }
    
    if (!usuario) {
      console.log(`Usuario no encontrado: ${identifier}`);
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
    
    console.log(`Usuario encontrado con ID: ${usuario.id}`);
    
    
    const passwordCorrecto = await bcrypt.compare(password, usuario.password);
    
    console.log(`Verificación de contraseña: ${passwordCorrecto ? 'Correcta' : 'Incorrecta'}`);
    
    if (!passwordCorrecto) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }
    
    console.log('Contraseña correcta. Generando token...');
    if (!usuario.rol) {
      console.error('Error: Rol de usuario no definido para ID:', usuario.id);
      return res.status(500).json({ mensaje: 'Error interno del servidor: rol de usuario no definido.' });
    }
    
    const token = jwt.sign(
      { 
        id: usuario.id,
        email: usuario.email,
        rol: usuario.rol
      },
      process.env.JWT_SECRET || 'secreto_jwt',
      { expiresIn: '8h' }
    );
    
    
    res.json({
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        rol: usuario.rol,
        codigo_institucional: usuario.codigo_institucional 

      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ mensaje: 'Error al iniciar sesión' });
  }
}
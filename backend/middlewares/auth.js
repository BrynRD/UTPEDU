const jwt = require('jsonwebtoken');


const verificarToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ mensaje: 'No se proporcionó token de autenticación' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_jwt');
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};


const verificarRol = (roles = []) => {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(403).json({ mensaje: 'No autorizado' });
    }
    
    if (roles.length && !roles.includes(req.usuario.rol)) {
      return res.status(403).json({ mensaje: 'No tienes permiso para acceder a este recurso' });
    }
    
    next();
  };
};

module.exports = { verificarToken, verificarRol };
const jwt = require('jsonwebtoken');


const verificarToken = (req, res, next) => {
  console.log('Auth Middleware: Checking token for request path:', req.path);
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    console.log('Auth Middleware: No token provided.');
    return res.status(403).json({ mensaje: 'No se proporcionó token de autenticación' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secreto_jwt');
    req.usuario = decoded;
    console.log('Auth Middleware: Token verified for user:', decoded.id);
    next();
  } catch (error) {
    console.error('Auth Middleware: Token verification failed:', error.message);
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
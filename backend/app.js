const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');


const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const recursoRoutes = require('./routes/recursos');
const categoriaRoutes = require('./routes/categoriaRoutes');
const adminRoutes = require('./routes/adminRoutes');
const incidenciasRoutes = require('./routes/incidencias');

const recursoController = require('./controllers/recursoController');
const authMiddleware = require('./middlewares/auth').verificarToken;


const { initializeDatabase } = require('./config/db');

dotenv.config();


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  console.log(`Incoming Request: ${req.method} ${req.originalUrl}`);
  if (req.method === 'POST' && req.path.includes('/login')) {
    const bodySafe = { ...req.body };
    if (bodySafe.password) bodySafe.password = '***';
    console.log('Solicitud de login recibida:', {
      contentType: req.headers['content-type'],
      bodyPresente: !!req.body,
      bodyContenido: bodySafe
    });
  }
  next();
});


app.use(cors({
  origin: function(origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000',
      'https://localhost:3001',
      'http://127.0.0.1:3000',
      'https://127.0.0.1:3000',
      /\.ngrok-free\.app$/,
      /\.ngrok\.io$/
    ];
    
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    })) {
      callback(null, true);
    } else {
      callback(new Error(`Origen no permitido por CORS: ${origin}`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Disposition'],
}));


app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);

console.log('Registering Recurso Routes under /api/recursos');
app.use('/api/recursos', (req, res, next) => {
  console.log('🔍 DEBUG: Request to /api/recursos with path:', req.path, 'Method:', req.method);
  console.log('🔍 DEBUG: Full URL:', req.originalUrl);
  next();
}, recursoRoutes);

app.use('/api/categorias', categoriaRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/incidencias', incidenciasRoutes);


app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Plataforma de Recursos Educativos' });
});


app.use((req, res, next) => {
  console.error(`404 Not Found: ${req.method} ${req.originalUrl}`);
  next();
});


const PORT = process.env.PORT || 3001;


initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch(err => {
  console.error('Error al inicializar la aplicación:', err);
});

module.exports = app;
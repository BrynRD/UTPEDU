const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const recursoRoutes = require('./routes/recursoRoutes');
const categoriaRoutes = require('./routes/categoriaRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Importar configuración de base de datos
const { initializeDatabase } = require('./config/db');

// Cargar variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use((req, res, next) => {
  if (req.method === 'POST' && req.path.includes('/login')) {
    console.log('Solicitud de login recibida:', {
      contentType: req.headers['content-type'],
      bodyPresente: !!req.body,
      bodyContenido: req.body
    });
  }
  next();
});

// Configuración de CORS
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
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/recursos', recursoRoutes);
app.use('/api/categorias', categoriaRoutes);
app.use('/api/admin', adminRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Plataforma de Recursos Educativos' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;

// Inicializar la base de datos y luego iniciar el servidor
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
  });
}).catch(err => {
  console.error('Error al inicializar la aplicación:', err);
});

module.exports = app;
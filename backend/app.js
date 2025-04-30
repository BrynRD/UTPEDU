// app.js
const express = require('express');
const { initializeDatabase } = require('./config/db');  // Importar la configuración de la base de datos

const app = express();
const port = process.env.PORT || 3001;

// Inicializar la base de datos (verifica la conexión)
initializeDatabase().then(() => {
  console.log('Servidor listo para aceptar solicitudes');
}).catch((err) => {
  console.error('Error al inicializar la base de datos:', err);
});

// Rutas y lógica de la aplicación
app.get('/', (req, res) => {
  res.send('Hola, el servidor está funcionando');
});

app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});

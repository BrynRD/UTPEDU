const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'EDUUTP',
};


const pool = mysql.createPool(dbConfig);


async function initializeDatabase() {
  const maxRetries = 15; // Aumentar los reintentos
  const delay = 3000; // ms
  let retries = 0;

  while (retries < maxRetries) {
    try {
      await pool.query('SELECT 1');
      console.log('Conexión a la base de datos establecida');
      return pool;
    } catch (error) {
      retries++;
      console.warn(`Error al conectar a la base de datos (Intento ${retries}/${maxRetries}):`, error.message);
      if (retries < maxRetries) {
        console.log(`Reintentando en ${delay / 1000} segundos...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  console.error(`Fallo al conectar a la base de datos después de ${maxRetries} intentos.`);
  process.exit(1);
}

module.exports = { pool, initializeDatabase };
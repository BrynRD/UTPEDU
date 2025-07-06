const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Importar fs para manejar directorios

// Directorio temporal para Multer diskStorage
const tempUploadsDir = path.join(__dirname, '../temp-uploads');

// Crear el directorio temporal si no existe
if (!fs.existsSync(tempUploadsDir)) {
    fs.mkdirSync(tempUploadsDir);
}

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'text/plain'
  ];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

// Configurar Multer para usar memoryStorage (para Google Drive)
const upload = multer({
  storage: multer.memoryStorage(), // Cambiar a memoria para obtener buffer
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});

module.exports = upload;
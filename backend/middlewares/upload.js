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

// Configurar Multer para usar diskStorage
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, tempUploadsDir); // Guardar en el directorio temporal
    },
    filename: (req, file, cb) => {
      // Usar el nombre original del archivo (Multer añadirá una extensión si es necesario)
      cb(null, file.originalname);
    }
  }),
  fileFilter: fileFilter,
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB
  }
});

module.exports = upload;
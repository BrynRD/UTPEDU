const nextcloudService = require('./nextcloudService');

async function subirArchivoRecurso(file) {
  // Sube el archivo a Nextcloud en la carpeta /UTP+EDU
  const remotePath = `/UTP+EDU/${file.originalname}`;
  await nextcloudService.uploadFile(remotePath, file.buffer, file.mimetype);
  return remotePath;
}

async function descargarArchivoRecurso(filenameOrPath) {
  // Usar la ruta tal como viene de la base de datos (archivo_id)
  const remotePath = filenameOrPath;
  return await nextcloudService.downloadFile(remotePath);
}

async function listarArchivosRecurso() {
  return await nextcloudService.listFiles('/UTP+EDU');
}

module.exports = {
  subirArchivoRecurso,
  descargarArchivoRecurso,
  listarArchivosRecurso,
}; 
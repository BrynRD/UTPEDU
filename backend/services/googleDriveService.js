const { google } = require('googleapis');
const path = require('path');
const { Readable } = require('stream');

// Configurar las credenciales de Google Drive
const auth = new google.auth.GoogleAuth({
  keyFile: path.join(__dirname, '../config/google-credentials.json'),
  scopes: ['https://www.googleapis.com/auth/drive.file'],
});

const drive = google.drive({ version: 'v3', auth });

class GoogleDriveService {
  static async uploadFile(file, fileName) {
    try {
      const fileMetadata = {
        name: fileName,
        parents: [process.env.GOOGLE_DRIVE_FOLDER_ID], // ID de la carpeta en Drive
      };

      // Convertir el buffer a stream
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);

      const media = {
        mimeType: file.mimetype,
        body: bufferStream,
      };

      const response = await drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: 'id, webViewLink, webContentLink',
      });

      // Hacer el archivo público
      await drive.permissions.create({
        fileId: response.data.id,
        requestBody: {
          role: 'reader',
          type: 'anyone',
        },
      });

      return {
        fileId: response.data.id,
        webViewLink: response.data.webViewLink,
        webContentLink: response.data.webContentLink,
      };
    } catch (error) {
      console.error('Error al subir archivo a Google Drive:', error);
      throw error;
    }
  }

  static async deleteFile(fileId) {
    try {
      await drive.files.delete({
        fileId: fileId,
      });
      return true;
    } catch (error) {
      console.error('Error al eliminar archivo de Google Drive:', error);
      throw error;
    }
  }

  static async getFileUrl(fileId) {
    try {
      const response = await drive.files.get({
        fileId: fileId,
        fields: 'webViewLink, webContentLink',
      });
      return {
        webViewLink: response.data.webViewLink,
        webContentLink: response.data.webContentLink,
      };
    } catch (error) {
      console.error('Error al obtener URL del archivo:', error);
      throw error;
    }
  }
}

module.exports = GoogleDriveService; 
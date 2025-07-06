let createClientPromise = import('webdav').then(mod => mod.createClient);

const NEXTCLOUD_URL = process.env.NEXTCLOUD_URL;
const NEXTCLOUD_USER = process.env.NEXTCLOUD_USER;
const NEXTCLOUD_PASSWORD = process.env.NEXTCLOUD_PASSWORD;

async function getClient() {
  const createClient = await createClientPromise;
  return createClient(
    NEXTCLOUD_URL,
    {
      username: NEXTCLOUD_USER,
      password: NEXTCLOUD_PASSWORD,
    }
  );
}

async function uploadFile(remotePath, buffer, mimeType) {
  const client = await getClient();
  await client.putFileContents(remotePath, buffer, { contentType: mimeType });
  return `${NEXTCLOUD_URL}${remotePath}`;
}

async function downloadFile(remotePath) {
  const client = await getClient();
  const fileBuffer = await client.getFileContents(remotePath);
  return fileBuffer;
}

async function listFiles(folder = "/") {
  const client = await getClient();
  return await client.getDirectoryContents(folder);
}

// Eliminar archivo en Nextcloud
async function deleteFile(remotePath) {
  const client = await getClient();
  await client.deleteFile(remotePath);
}

module.exports = {
  uploadFile,
  downloadFile,
  listFiles,
  deleteFile,
};
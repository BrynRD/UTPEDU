
ALTER TABLE recursos
ADD COLUMN archivo_id VARCHAR(255) AFTER archivo_url,
MODIFY COLUMN archivo_url VARCHAR(500) COMMENT 'URL de Google Drive';
 

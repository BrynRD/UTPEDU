ALTER TABLE recursos
ADD COLUMN archivo_id VARCHAR(255) AFTER archivo_url,
MODIFY COLUMN archivo_url VARCHAR(500) COMMENT 'URL de Google Drive';

CREATE TABLE IF NOT EXISTS incidencias (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  asunto VARCHAR(200) NOT NULL,
  descripcion TEXT NOT NULL,
  fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  imagenUrl VARCHAR(500),
  usuario_id INT,
  INDEX (email),
  INDEX (usuario_id)
);
 

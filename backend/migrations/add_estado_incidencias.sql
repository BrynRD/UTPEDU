-- Agregar campo estado a la tabla incidencias
ALTER TABLE incidencias 
ADD COLUMN estado ENUM('pendiente', 'en_proceso', 'resuelta') DEFAULT 'pendiente' AFTER descripcion;

-- Crear índice para mejorar consultas por estado
CREATE INDEX idx_incidencias_estado ON incidencias(estado);

-- Actualizar incidencias existentes (opcional - todas las existentes quedarán como 'pendiente')
-- UPDATE incidencias SET estado = 'pendiente' WHERE estado IS NULL; 
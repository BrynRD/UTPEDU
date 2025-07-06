CREATE DATABASE  IF NOT EXISTS `utpedu` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `utpedu`;

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin'),(2,'docente'),(4,'estudiante'),(3,'moderador');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol_id` int(11) NOT NULL,
  `institucion` varchar(200) NOT NULL DEFAULT 'Universidad Tecnológica del Perú',
  `area_especialidad` varchar(100) NOT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `codigo_institucional` varchar(20) DEFAULT NULL,
  `activo` tinyint(1) DEFAULT 1,
  `telefono` varchar(20) DEFAULT NULL,
  `biografia` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`),
  KEY `rol_id` (`rol_id`),
  KEY `idx_usuarios_registro` (`fecha_registro`),
  KEY `idx_usuarios_activo` (`activo`),
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Brayan','Rivera','brayan@gmail.com','$2b$10$p0o4W0oD2G6yquWjio3ip.1gXH1hXcBrsoLLrtj6FU.ui57.3.efe',1,'Universidad Tecnológica del Perú','tecnologia','2025-04-30 03:19:30',NULL,1,NULL,NULL),(2,'Remigio','Santos','C31585@utp.edu.pe','$2b$10$wqB29JBdciN8lAMia3xWXuHZj1e6HV6QosVbQdtu1fsjRxbidgqsu',2,'Universidad Tecnológica del Perú','docente','2025-05-02 04:31:09','C31585',1,NULL,NULL),(3,'Carlos','Rojas','U1597426@utp.edu.pe','$2b$10$TLD.1BHQxYQ/mRCH7/I/POK4wgEs87nlF1.fefT0BEeVT1DoH9RZu',4,'Universidad Tecnológica del Perú','estudiante','2025-05-02 05:55:04','U1597426',1,NULL,NULL),(4,'Lucas','Mendieta','C00001@utp.edu.pe','$2b$10$aVwvtMmK4t63lEw/vjwbBuwwiROD37foERpp0dyjYsHYarfR6KGVu',4,'Universidad Tecnológica del Perú','docente','2025-05-02 08:00:53','C00001',0,NULL,NULL),(5,'Camila','Ramirez','C00002@utp.edu.pe','$2b$10$Tm.nJd2fw8./YE6QrkmxW.J8Yb/v0Yz7C9.E2/jEQ5LO2BKGUXuN2',4,'Universidad Tecnológica del Perú','docente','2025-05-02 10:08:30','C00002',1,NULL,NULL),(6,'Maria','Jimenez','U0000003@utp.edu.pe','$2b$10$0GFWSs3NYu1zwMbA8qycxeUqdbzpCI/YIk50dipmBO7TBZyVYXAw2',4,'Universidad Tecnológica del Perú','estudiante','2025-05-02 12:26:45','U0000003',0,NULL,NULL),(7,'Juanito','Chavez','U0000005@utp.edu.pe','$2b$10$Nr2GXwqAr18GQvueono6d.oiy.wzEIZtZ.HVs7Pzl10AginKx1FgS',4,'Universidad Tecnológica del Perú','estudiante','2025-05-02 12:42:48','U0000005',1,NULL,NULL),(8,'Camila','Perez','C00005@utp.edu.pe','$2b$10$Z0k0jl2Ui8x45IQRYg5fdewB4faurFWHBxFA5sOZ9TwS3o/Z.x2V2',4,'Universidad Tecnológica del Perú','docente','2025-05-02 12:52:23','C00005',1,NULL,NULL),(9,'Lucas','Rodriguez','U0000008@utp.edu.pe','$2b$10$l9AXcSfqNlFZt7aZjvxB9OP8Mxe6kh7H0dAR.0G7wVSMH0JMcActG',4,'Universidad Tecnológica del Perú','estudiante','2025-05-05 20:05:01','U0000008',1,NULL,NULL),(10,'Maria','Cabrero','U0000009@utp.edu.pe','$2b$10$USS/H1LBdvwP3LSun9DIpeUl5vhSgQXhYTzsNHWmUb7qtpa1BE/9i',4,'Universidad Tecnológica del Perú','estudiante','2025-05-05 20:17:17','U0000009',1,'',''),(12,'Juan','Pérez','juan.perez@utp.edu.pe','$2b$10$8qBj9F6owPyCqxAYd8BaBeLwVN/5voKC65fT8WmUaM8cnDC5H9yMy',1,'Universidad Tecnológica del Perú','Ingeniería','2025-07-03 22:25:21','U1234567',1,NULL,NULL);
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `categorias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categorias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `descripcion` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Matemáticas','Recursos relacionados con matemáticas'),(2,'Ciencias','Recursos relacionados con ciencias naturales'),(3,'Lenguaje','Recursos relacionados con lenguaje y literatura'),(4,'Historia','Recursos relacionados con historia y ciencias sociales'),(5,'Arte','Recursos relacionados con arte y música'),(6,'Tecnología','Recursos relacionados con tecnología e informática'),(7,'Programación',NULL);
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recursos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(200) NOT NULL,
  `descripcion` text NOT NULL,
  `archivo_url` varchar(500) DEFAULT NULL COMMENT 'URL de Google Drive',
  `archivo_id` varchar(255) DEFAULT NULL,
  `tipo_archivo` varchar(10) DEFAULT NULL,
  `descargas` int(11) DEFAULT 0,
  `categoria_id` int(11) NOT NULL,
  `usuario_id` int(11) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `idx_recursos_titulo` (`titulo`),
  KEY `idx_recursos_fecha` (`fecha_creacion`),
  KEY `idx_recursos_descargas` (`descargas`),
  KEY `idx_recursos_tipo` (`tipo_archivo`),
  KEY `idx_recursos_categoria_fecha` (`categoria_id`,`fecha_creacion`),
  FULLTEXT KEY `idx_recursos_busqueda` (`titulo`,`descripcion`),
  CONSTRAINT `recursos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
  CONSTRAINT `recursos_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `recursos` WRITE;
/*!40000 ALTER TABLE `recursos` DISABLE KEYS */;
INSERT INTO `recursos` VALUES (12,'PRUEBA PDF','pdf','/UTP+EDU/BOCETO ARTEMIO LAGOS - 2025 dwg-Model.pdf','/UTP+EDU/BOCETO ARTEMIO LAGOS - 2025 dwg-Model.pdf','PDF',24,6,2,'2025-07-01 23:25:44'),(13,'Proyecto Pagina Web-Strafe','Documentación de pagina web venta de ropa Strafe\r\n\r\n','/UTP+EDU/STRAFE .pdf','/UTP+EDU/STRAFE .pdf','PDF',6,6,2,'2025-07-04 04:09:56'),(14,'Álgebra Lineal - Matrices','Guía completa sobre operaciones con matrices','/matematicas/algebra_lineal.pdf','/matematicas/algebra_lineal.pdf','PDF',25,1,2,'2025-07-04 06:06:37'),(15,'Experimento de Física - Péndulo','Laboratorio virtual de péndulo simple','/ciencias/pendulo.html','/ciencias/pendulo.html','HTML',18,2,2,'2025-07-04 06:06:37'),(16,'Historia del Perú Republicano','Cronología de eventos importantes','/historia/peru_republicano.docx','/historia/peru_republicano.docx','DOCX',12,4,5,'2025-07-04 06:06:37'),(17,'Introducción a Python','Tutorial básico de programación en Python','/programacion/python_intro.zip','/programacion/python_intro.zip','ZIP',35,7,8,'2025-07-04 06:06:37');
/*!40000 ALTER TABLE `recursos` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `permisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permisos` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `crear_recursos` tinyint(1) DEFAULT 0,
  `editar_recursos` tinyint(1) DEFAULT 0,
  `eliminar_recursos` tinyint(1) DEFAULT 0,
  `gestionar_usuarios` tinyint(1) DEFAULT 0,
  `ver_estadisticas` tinyint(1) DEFAULT 0,
  `administrar_sistema` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `permisos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `permisos` WRITE;
/*!40000 ALTER TABLE `permisos` DISABLE KEYS */;
INSERT INTO `permisos` VALUES (1,2,1,1,0,1,0,0),(2,3,0,0,0,1,0,0);
/*!40000 ALTER TABLE `permisos` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `incidencias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incidencias` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `asunto` varchar(200) NOT NULL,
  `descripcion` text NOT NULL,
  `estado` enum('pendiente','en_proceso','resuelta') DEFAULT 'pendiente',
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `imagenUrl` varchar(500) DEFAULT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `email` (`email`),
  KEY `usuario_id` (`usuario_id`),
  KEY `idx_incidencias_estado` (`estado`),
  CONSTRAINT `fk_incidencias_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `incidencias` WRITE;
/*!40000 ALTER TABLE `incidencias` DISABLE KEYS */;
INSERT INTO `incidencias` VALUES (19,'Remigio Santos','luluvigilante25@gmail.com','PRUBEA 500','Hola no puedo descargar los recursos educativos, aparece el error de la imagen adjuntada.','pendiente','2025-07-03 20:54:24','https://i.ibb.co/PG4QjS0v/Texto-del-p-rrafo.png',2),(21,'Remigio Santos','C31585@utp.edu.pe','PRUEBA 5','1','pendiente','2025-07-03 21:03:24','https://i.ibb.co/TxqDQYn7/1NEGRO.webp',2),(23,'Remigio Santos','briveradurand@gmail.com','asda','asda','pendiente','2025-07-03 21:24:51','https://i.ibb.co/zWq75Mjy/ARQUITECTURA-DE-SOFTWARE-UTPEDU.png',2),(24,'Test User','testuser@utp.edu.pe','Prueba Jest','Esto es una incidencia de prueba','pendiente','2025-07-03 22:18:15',NULL,1),(25,'Test User','testuser@utp.edu.pe','Prueba Jest','Esto es una incidencia de prueba','pendiente','2025-07-03 22:22:21',NULL,1),(26,'Test User','testuser@utp.edu.pe','Prueba Jest','Esto es una incidencia de prueba','pendiente','2025-07-03 22:23:32',NULL,1),(27,'Test User','testuser@utp.edu.pe','Prueba Jest','Esto es una incidencia de prueba','pendiente','2025-07-03 22:25:21',NULL,1);
/*!40000 ALTER TABLE `incidencias` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `colecciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `colecciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(200) NOT NULL,
  `descripcion` text DEFAULT NULL,
  `usuario_id` int(11) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `colecciones_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `colecciones` WRITE;
/*!40000 ALTER TABLE `colecciones` DISABLE KEYS */;
INSERT INTO `colecciones` VALUES (1,'Matemáticas Avanzadas','Recursos para cursos de matemática superior',2,'2025-07-04 06:06:37'),(2,'Laboratorios Virtuales','Experimentos interactivos de ciencias',5,'2025-07-04 06:06:37'),(3,'Programación para Principiantes','Recursos introductorios de programación',8,'2025-07-04 06:06:37');
/*!40000 ALTER TABLE `colecciones` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `coleccion_recursos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coleccion_recursos` (
  `coleccion_id` int(11) NOT NULL,
  `recurso_id` int(11) NOT NULL,
  PRIMARY KEY (`coleccion_id`,`recurso_id`),
  KEY `recurso_id` (`recurso_id`),
  CONSTRAINT `coleccion_recursos_ibfk_1` FOREIGN KEY (`coleccion_id`) REFERENCES `colecciones` (`id`) ON DELETE CASCADE,
  CONSTRAINT `coleccion_recursos_ibfk_2` FOREIGN KEY (`recurso_id`) REFERENCES `recursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `coleccion_recursos` WRITE;
/*!40000 ALTER TABLE `coleccion_recursos` DISABLE KEYS */;
/*!40000 ALTER TABLE `coleccion_recursos` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `descargas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `descargas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `usuario_id` int(11) NOT NULL,
  `recurso_id` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `recurso_id` (`recurso_id`),
  KEY `idx_descargas_fecha` (`fecha`),
  CONSTRAINT `descargas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `descargas_ibfk_2` FOREIGN KEY (`recurso_id`) REFERENCES `recursos` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `descargas` WRITE;
/*!40000 ALTER TABLE `descargas` DISABLE KEYS */;
INSERT INTO `descargas` VALUES (1,3,12,'2025-07-04 06:06:37'),(2,7,12,'2025-07-04 06:06:37'),(3,9,12,'2025-07-04 06:06:37'),(4,10,12,'2025-07-04 06:06:37'),(5,3,13,'2025-07-04 06:06:37'),(6,7,13,'2025-07-04 06:06:37'),(7,9,13,'2025-07-04 06:06:37'),(8,10,14,'2025-07-04 06:06:37'),(9,3,14,'2025-07-04 06:06:37'),(10,7,15,'2025-07-04 06:06:37'),(11,9,15,'2025-07-04 06:06:37');
/*!40000 ALTER TABLE `descargas` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos` (
  `usuario_id` int(11) NOT NULL,
  `recurso_id` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`usuario_id`,`recurso_id`),
  KEY `recurso_id` (`recurso_id`),
  CONSTRAINT `favoritos_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favoritos_ibfk_2` FOREIGN KEY (`recurso_id`) REFERENCES `recursos` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
INSERT INTO `favoritos` VALUES (3,12,'2025-07-04 06:06:37'),(3,13,'2025-07-04 06:06:37'),(7,12,'2025-07-04 06:06:37'),(9,15,'2025-07-04 06:06:37'),(10,14,'2025-07-04 06:06:37');
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `configuraciones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `configuraciones` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `clave` varchar(100) NOT NULL,
  `valor` text DEFAULT NULL,
  `descripcion` text DEFAULT NULL,
  `tipo` enum('string','number','boolean','json') DEFAULT 'string',
  `fecha_modificacion` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `clave` (`clave`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `configuraciones` WRITE;
/*!40000 ALTER TABLE `configuraciones` DISABLE KEYS */;
INSERT INTO `configuraciones` VALUES 
(1,'tamaño_max_archivo_mb','50','Tamaño máximo de archivo en MB','number','2025-07-04 06:06:37'),
(2,'recursos_por_pagina','12','Número de recursos por página','number','2025-07-04 06:06:37'),
(3,'permitir_registro_publico','false','Permitir registro sin invitación','boolean','2025-07-04 06:06:37'),
(4,'email_notificaciones','true','Enviar notificaciones por email','boolean','2025-07-04 06:06:37'),
(5,'version_sistema','1.0.0','Versión actual del sistema','string','2025-07-04 06:06:37'),
(6,'mantenimiento','false','Modo mantenimiento activo','boolean','2025-07-04 06:06:37');
/*!40000 ALTER TABLE `configuraciones` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `etiquetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `etiquetas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `color` varchar(7) DEFAULT '#007bff',
  `descripcion` text DEFAULT NULL,
  `activa` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `nombre` (`nombre`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `etiquetas` WRITE;
/*!40000 ALTER TABLE `etiquetas` DISABLE KEYS */;
INSERT INTO `etiquetas` VALUES 
(1,'Básico','#28a745','Contenido de nivel básico',1),
(2,'Intermedio','#ffc107','Contenido de nivel intermedio',1),
(3,'Avanzado','#dc3545','Contenido de nivel avanzado',1),
(4,'Tutorial','#17a2b8','Material tutorial paso a paso',1),
(5,'Ejercicios','#6f42c1','Ejercicios prácticos',1),
(6,'Evaluación','#fd7e14','Material de evaluación',1),
(7,'Laboratorio','#20c997','Prácticas de laboratorio',1),
(8,'Teoría','#6c757d','Contenido teórico',1);
/*!40000 ALTER TABLE `etiquetas` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `recurso_etiquetas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `recurso_etiquetas` (
  `recurso_id` int(11) NOT NULL,
  `etiqueta_id` int(11) NOT NULL,
  `fecha_asignacion` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`recurso_id`,`etiqueta_id`),
  KEY `etiqueta_id` (`etiqueta_id`),
  CONSTRAINT `recurso_etiquetas_ibfk_1` FOREIGN KEY (`recurso_id`) REFERENCES `recursos` (`id`) ON DELETE CASCADE,
  CONSTRAINT `recurso_etiquetas_ibfk_2` FOREIGN KEY (`etiqueta_id`) REFERENCES `etiquetas` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `recurso_etiquetas` WRITE;
/*!40000 ALTER TABLE `recurso_etiquetas` DISABLE KEYS */;
/*!40000 ALTER TABLE `recurso_etiquetas` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `tipos_archivo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tipos_archivo` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `extension` varchar(10) NOT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `tamaño_max_mb` int(11) DEFAULT 10,
  `permitido` tinyint(1) DEFAULT 1,
  `icono` varchar(100) DEFAULT 'file',
  PRIMARY KEY (`id`),
  UNIQUE KEY `extension` (`extension`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `tipos_archivo` WRITE;
/*!40000 ALTER TABLE `tipos_archivo` DISABLE KEYS */;
INSERT INTO `tipos_archivo` VALUES 
(1,'pdf','application/pdf',50,'file-pdf',1),
(2,'docx','application/vnd.openxmlformats-officedocument.wordprocessingml.document',25,'file-word',1),
(3,'pptx','application/vnd.openxmlformats-officedocument.presentationml.presentation',100,'file-powerpoint',1),
(4,'xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',25,'file-excel',1),
(5,'mp4','video/mp4',500,'file-video',1),
(6,'mp3','audio/mpeg',50,'file-audio',1),
(7,'zip','application/zip',100,'file-archive',1),
(8,'rar','application/x-rar-compressed',100,'file-archive',1),
(9,'jpg','image/jpeg',10,'file-image',1),
(10,'png','image/png',10,'file-image',1);
/*!40000 ALTER TABLE `tipos_archivo` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `auditoria`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auditoria` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `tabla` varchar(100) NOT NULL,
  `accion` enum('INSERT','UPDATE','DELETE') NOT NULL,
  `usuario_id` int(11) DEFAULT NULL,
  `registro_id` int(11) DEFAULT NULL,
  `datos_anteriores` JSON DEFAULT NULL,
  `datos_nuevos` JSON DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `ip` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `usuario_id` (`usuario_id`),
  KEY `idx_auditoria_tabla_fecha` (`tabla`, `fecha`),
  CONSTRAINT `auditoria_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

LOCK TABLES `auditoria` WRITE;
/*!40000 ALTER TABLE `auditoria` DISABLE KEYS */;
/*!40000 ALTER TABLE `auditoria` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `v_estadisticas_recursos`;
/*!50001 DROP VIEW IF EXISTS `v_estadisticas_recursos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_estadisticas_recursos` AS SELECT 
 1 AS `categoria`,
 1 AS `total_recursos`,
 1 AS `total_descargas`,
 1 AS `promedio_descargas`*/;
SET character_set_client = @saved_cs_client;

DROP TABLE IF EXISTS `v_recursos_completos`;
/*!50001 DROP VIEW IF EXISTS `v_recursos_completos`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_recursos_completos` AS SELECT 
 1 AS `id`,
 1 AS `titulo`,
 1 AS `descripcion`,
 1 AS `tipo_archivo`,
 1 AS `descargas`,
 1 AS `fecha_creacion`,
 1 AS `categoria`,
 1 AS `autor`,
 1 AS `area_autor`*/;
SET character_set_client = @saved_cs_client;

DROP TABLE IF EXISTS `v_recursos_con_etiquetas`;
/*!50001 DROP VIEW IF EXISTS `v_recursos_con_etiquetas`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_recursos_con_etiquetas` AS SELECT 
 1 AS `id`,
 1 AS `titulo`,
 1 AS `descripcion`,
 1 AS `tipo_archivo`,
 1 AS `descargas`,
 1 AS `fecha_creacion`,
 1 AS `categoria`,
 1 AS `autor`,
 1 AS `etiquetas`,
 1 AS `colores_etiquetas`*/;
SET character_set_client = @saved_cs_client;

DROP TABLE IF EXISTS `v_estadisticas_sistema`;
/*!50001 DROP VIEW IF EXISTS `v_estadisticas_sistema`*/;
SET @saved_cs_client     = @@character_set_client;
/*!50503 SET character_set_client = utf8mb4 */;
/*!50001 CREATE VIEW `v_estadisticas_sistema` AS SELECT 
 1 AS `usuarios_activos`,
 1 AS `total_recursos`,
 1 AS `total_descargas`,
 1 AS `incidencias_pendientes`,
 1 AS `total_categorias`,
 1 AS `total_colecciones`,
 1 AS `etiquetas_activas`*/;
SET character_set_client = @saved_cs_client;

/*!50001 DROP VIEW IF EXISTS `v_estadisticas_recursos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_estadisticas_recursos` AS select `c`.`nombre` AS `categoria`,count(`r`.`id`) AS `total_recursos`,sum(`r`.`descargas`) AS `total_descargas`,avg(`r`.`descargas`) AS `promedio_descargas` from (`categorias` `c` left join `recursos` `r` on(`c`.`id` = `r`.`categoria_id`)) group by `c`.`id`,`c`.`nombre` */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

/*!50001 DROP VIEW IF EXISTS `v_recursos_completos`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_recursos_completos` AS select `r`.`id` AS `id`,`r`.`titulo` AS `titulo`,`r`.`descripcion` AS `descripcion`,`r`.`tipo_archivo` AS `tipo_archivo`,`r`.`descargas` AS `descargas`,`r`.`fecha_creacion` AS `fecha_creacion`,`c`.`nombre` AS `categoria`,concat(`u`.`nombre`,' ',`u`.`apellido`) AS `autor`,`u`.`area_especialidad` AS `area_autor` from ((`recursos` `r` join `categorias` `c` on(`r`.`categoria_id` = `c`.`id`)) join `usuarios` `u` on(`r`.`usuario_id` = `u`.`id`)) where `u`.`activo` = 1 */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

/*!50001 DROP VIEW IF EXISTS `v_recursos_con_etiquetas`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_recursos_con_etiquetas` AS
SELECT 
    r.id,
    r.titulo,
    r.descripcion,
    r.tipo_archivo,
    r.descargas,
    r.fecha_creacion,
    c.nombre as categoria,
    CONCAT(u.nombre, ' ', u.apellido) as autor,
    GROUP_CONCAT(e.nombre SEPARATOR ', ') as etiquetas,
    GROUP_CONCAT(e.color SEPARATOR ',') as colores_etiquetas
FROM recursos r
JOIN categorias c ON r.categoria_id = c.id
JOIN usuarios u ON r.usuario_id = u.id
LEFT JOIN recurso_etiquetas re ON r.id = re.recurso_id
LEFT JOIN etiquetas e ON re.etiqueta_id = e.id AND e.activa = 1
WHERE u.activo = 1
GROUP BY r.id, r.titulo, r.descripcion, r.tipo_archivo, r.descargas, r.fecha_creacion, c.nombre, u.nombre, u.apellido */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

/*!50001 DROP VIEW IF EXISTS `v_estadisticas_sistema`*/;
/*!50001 SET @saved_cs_client          = @@character_set_client */;
/*!50001 SET @saved_cs_results         = @@character_set_results */;
/*!50001 SET @saved_col_connection     = @@collation_connection */;
/*!50001 SET character_set_client      = utf8mb4 */;
/*!50001 SET character_set_results     = utf8mb4 */;
/*!50001 SET collation_connection      = utf8mb4_general_ci */;
/*!50001 CREATE ALGORITHM=UNDEFINED */
/*!50013 DEFINER=`root`@`localhost` SQL SECURITY DEFINER */
/*!50001 VIEW `v_estadisticas_sistema` AS
SELECT 
    (SELECT COUNT(*) FROM usuarios WHERE activo = 1) as usuarios_activos,
    (SELECT COUNT(*) FROM recursos) as total_recursos,
    (SELECT SUM(descargas) FROM recursos) as total_descargas,
    (SELECT COUNT(*) FROM incidencias WHERE estado = 'pendiente') as incidencias_pendientes,
    (SELECT COUNT(*) FROM categorias) as total_categorias,
    (SELECT COUNT(*) FROM colecciones) as total_colecciones,
    (SELECT COUNT(*) FROM etiquetas WHERE activa = 1) as etiquetas_activas */;
/*!50001 SET character_set_client      = @saved_cs_client */;
/*!50001 SET character_set_results     = @saved_cs_results */;
/*!50001 SET collation_connection      = @saved_col_connection */;

DELIMITER $$

CREATE PROCEDURE IF NOT EXISTS sp_registrar_descarga(
    IN p_usuario_id INT,
    IN p_recurso_id INT
)
BEGIN
    DECLARE v_error INT DEFAULT 0;
    DECLARE CONTINUE HANDLER FOR SQLEXCEPTION SET v_error = 1;
    
    START TRANSACTION;
    
    INSERT INTO descargas (usuario_id, recurso_id) 
    VALUES (p_usuario_id, p_recurso_id);
    
    UPDATE recursos 
    SET descargas = descargas + 1 
    WHERE id = p_recurso_id;
    
    IF v_error = 0 THEN
        COMMIT;
        SELECT 'Descarga registrada exitosamente' AS mensaje;
    ELSE
        ROLLBACK;
        SELECT 'Error al registrar descarga' AS mensaje;
    END IF;
END $$

CREATE PROCEDURE IF NOT EXISTS sp_estadisticas_usuario(
    IN p_usuario_id INT
)
BEGIN
    SELECT 
        u.nombre,
        u.apellido,
        r.nombre as rol,
        u.area_especialidad,
        COUNT(DISTINCT rec.id) as recursos_subidos,
        COALESCE(SUM(rec.descargas), 0) as total_descargas_recursos,
        COUNT(DISTINCT d.id) as mis_descargas,
        COUNT(DISTINCT f.recurso_id) as favoritos,
        COUNT(DISTINCT col.id) as colecciones_creadas,
        COUNT(DISTINCT inc.id) as incidencias_reportadas
    FROM usuarios u
    JOIN roles r ON u.rol_id = r.id
    LEFT JOIN recursos rec ON u.id = rec.usuario_id
    LEFT JOIN descargas d ON u.id = d.usuario_id
    LEFT JOIN favoritos f ON u.id = f.usuario_id
    LEFT JOIN colecciones col ON u.id = col.usuario_id
    LEFT JOIN incidencias inc ON u.id = inc.usuario_id
    WHERE u.id = p_usuario_id
    GROUP BY u.id, u.nombre, u.apellido, r.nombre, u.area_especialidad;
END $$

CREATE FUNCTION IF NOT EXISTS fn_tiene_permiso(
    p_usuario_id INT,
    p_permiso VARCHAR(50)
) RETURNS BOOLEAN
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE v_tiene_permiso BOOLEAN DEFAULT FALSE;
    
    SELECT CASE p_permiso
        WHEN 'crear_recursos' THEN COALESCE(crear_recursos, 0)
        WHEN 'editar_recursos' THEN COALESCE(editar_recursos, 0)
        WHEN 'eliminar_recursos' THEN COALESCE(eliminar_recursos, 0)
        WHEN 'gestionar_usuarios' THEN COALESCE(gestionar_usuarios, 0)
        WHEN 'ver_estadisticas' THEN COALESCE(ver_estadisticas, 0)
        WHEN 'administrar_sistema' THEN COALESCE(administrar_sistema, 0)
        ELSE 0
    END INTO v_tiene_permiso
    FROM permisos 
    WHERE usuario_id = p_usuario_id;
    
    RETURN COALESCE(v_tiene_permiso, FALSE);
END $$

DELIMITER ;

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
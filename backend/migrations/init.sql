-- MySQL dump 10.13  Distrib 8.0.42, for Win64 (x86_64)
--
-- Host: localhost    Database: utpedu
-- ------------------------------------------------------
-- Server version	5.5.5-10.4.32-MariaDB

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

--
-- Table structure for table `categorias`
--

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

--
-- Dumping data for table `categorias`
--

LOCK TABLES `categorias` WRITE;
/*!40000 ALTER TABLE `categorias` DISABLE KEYS */;
INSERT INTO `categorias` VALUES (1,'Matemáticas','Recursos relacionados con matemáticas'),(2,'Ciencias','Recursos relacionados con ciencias naturales'),(3,'Lenguaje','Recursos relacionados con lenguaje y literatura'),(4,'Historia','Recursos relacionados con historia y ciencias sociales'),(5,'Arte','Recursos relacionados con arte y música'),(6,'Tecnología','Recursos relacionados con tecnología e informática'),(7,'Programación',NULL);
/*!40000 ALTER TABLE `categorias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coleccion_recursos`
--

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

--
-- Dumping data for table `coleccion_recursos`
--

LOCK TABLES `coleccion_recursos` WRITE;
/*!40000 ALTER TABLE `coleccion_recursos` DISABLE KEYS */;
/*!40000 ALTER TABLE `coleccion_recursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `colecciones`
--

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `colecciones`
--

LOCK TABLES `colecciones` WRITE;
/*!40000 ALTER TABLE `colecciones` DISABLE KEYS */;
/*!40000 ALTER TABLE `colecciones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `descargas`
--

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
  CONSTRAINT `descargas_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `descargas_ibfk_2` FOREIGN KEY (`recurso_id`) REFERENCES `recursos` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `descargas`
--

LOCK TABLES `descargas` WRITE;
/*!40000 ALTER TABLE `descargas` DISABLE KEYS */;
/*!40000 ALTER TABLE `descargas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos`
--

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

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permisos`
--

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

--
-- Dumping data for table `permisos`
--

LOCK TABLES `permisos` WRITE;
/*!40000 ALTER TABLE `permisos` DISABLE KEYS */;
INSERT INTO `permisos` VALUES (1,2,1,1,0,1,0,0),(2,3,0,0,0,1,0,0);
/*!40000 ALTER TABLE `permisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `recursos`
--

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
  KEY `categoria_id` (`categoria_id`),
  KEY `usuario_id` (`usuario_id`),
  CONSTRAINT `recursos_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`),
  CONSTRAINT `recursos_ibfk_2` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `recursos`
--

LOCK TABLES `recursos` WRITE;
/*!40000 ALTER TABLE `recursos` DISABLE KEYS */;
INSERT INTO `recursos` VALUES (1,'Introducción a la Programación con Java','Conceptos básicos y primeros pasos en Java.','/uploads/intro_java.pdf',NULL,NULL,0,6,6,'2025-06-04 04:30:53'),(2,'Principios Fundamentales de Álgebra Lineal','Matrices, vectores y sistemas de ecuaciones.','/uploads/algebra_lineal.pdf',NULL,NULL,0,1,7,'2025-06-04 04:30:53'),(3,'La Célula: Estructura y Función','Apuntes de biología celular para estudiantes.','/uploads/la_celula.docx',NULL,NULL,0,2,10,'2025-06-04 04:30:53'),(4,'Guía de Estilo APA para Citas y Referencias','Cómo formatear trabajos académicos según normas APA.','/uploads/guia_apa.pdf',NULL,NULL,0,3,9,'2025-06-04 04:30:53'),(5,'Historia del Perú: Época Colonial','Resumen de los principales eventos y procesos coloniales.','/uploads/historia_colonial_peru.pdf',NULL,NULL,0,4,3,'2025-06-04 04:30:53'),(29,'Proyecto Final Formato','Formato de entrega','https://drive.google.com/file/d/1Sv5hvOnI5Ae_w5qrswBVQ0HUF_0yVKnz/view?usp=drivesdk','1Sv5hvOnI5Ae_w5qrswBVQ0HUF_0yVKnz','PDF',5,7,2,'2025-06-05 00:27:51'),(31,'Cronograma Scrum','Plantilla brindada por el profesor','https://docs.google.com/spreadsheets/d/1zsuKkrK0ZJ7lG5zSzm3iswOMHBxOizEf/edit?usp=drivesdk&ouid=115532847368933637003&rtpof=true&sd=true','1zsuKkrK0ZJ7lG5zSzm3iswOMHBxOizEf','XLSX',4,6,2,'2025-06-05 00:33:25'),(32,'Prueba','Prueba','https://drive.google.com/file/d/15h_fFVb6IVw14xL_4xi-Ac4wRi35yFES/view?usp=drivesdk','15h_fFVb6IVw14xL_4xi-Ac4wRi35yFES','PDF',3,2,2,'2025-06-05 00:46:21');
/*!40000 ALTER TABLE `recursos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

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

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin'),(2,'docente'),(4,'estudiante'),(3,'moderador');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuarios`
--

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
  CONSTRAINT `usuarios_ibfk_1` FOREIGN KEY (`rol_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuarios`
--

LOCK TABLES `usuarios` WRITE;
/*!40000 ALTER TABLE `usuarios` DISABLE KEYS */;
INSERT INTO `usuarios` VALUES (1,'Brayan','Rivera','brayan@gmail.com','$2b$10$p0o4W0oD2G6yquWjio3ip.1gXH1hXcBrsoLLrtj6FU.ui57.3.efe',1,'Universidad Tecnológica del Perú','tecnologia','2025-04-30 03:19:30',NULL,1,NULL,NULL),(2,'Remigio','Santos','C31585@utp.edu.pe','$2b$10$wqB29JBdciN8lAMia3xWXuHZj1e6HV6QosVbQdtu1fsjRxbidgqsu',2,'Universidad Tecnológica del Perú','docente','2025-05-02 04:31:09','C31585',1,NULL,NULL),(3,'Carlos','Rojas','U1597426@utp.edu.pe','$2b$10$TLD.1BHQxYQ/mRCH7/I/POK4wgEs87nlF1.fefT0BEeVT1DoH9RZu',4,'Universidad Tecnológica del Perú','estudiante','2025-05-02 05:55:04','U1597426',1,NULL,NULL),(4,'Lucas','Mendieta','C00001@utp.edu.pe','$2b$10$aVwvtMmK4t63lEw/vjwbBuwwiROD37foERpp0dyjYsHYarfR6KGVu',4,'Universidad Tecnológica del Perú','docente','2025-05-02 08:00:53','C00001',0,NULL,NULL),(5,'Camila','Ramirez','C00002@utp.edu.pe','$2b$10$Tm.nJd2fw8./YE6QrkmxW.J8Yb/v0Yz7C9.E2/jEQ5LO2BKGUXuN2',4,'Universidad Tecnológica del Perú','docente','2025-05-02 10:08:30','C00002',1,NULL,NULL),(6,'Maria','Jimenez','U0000003@utp.edu.pe','$2b$10$lHz351cxufuC6tRjnIPKgOsekD9X5D6smanjQdy4BQTjV44pn4TZi',4,'Universidad Tecnológica del Perú','estudiante','2025-05-02 12:26:45','U0000003',0,NULL,NULL),(7,'Juanito','Chavez','U0000005@utp.edu.pe','$2b$10$9Jym59fXCCHtiEjHN/pSveOOmJ7hJEV/we0jc/VYGTPk69s1vpEoa',4,'Universidad Tecnológica del Perú','estudiante','2025-05-02 12:42:48','U0000005',1,NULL,NULL),(8,'Camila','Perez','C00005@utp.edu.pe','$2b$10$jBsjXbc/vDKpbdnd1dBTTudTpsOnPqxwpvx9uI4/WFfVpsz1kSo22',4,'Universidad Tecnológica del Perú','docente','2025-05-02 12:52:23','C00005',1,NULL,NULL),(9,'Lucas','Rodriguez','U0000008@utp.edu.pe','$2b$10$.3RlROZ8KIkNh4bRuh2UH.kzGTpaduoZKFwcym2SHmGbyDTAeVkC.',4,'Universidad Tecnológica del Perú','estudiante','2025-05-05 20:05:01','U0000008',1,NULL,NULL),(10,'Maria','Cabrero','U0000009@utp.edu.pe','$2b$10$iWOGr9UpWjSjx8IUEPi7Du5HoPfBjQjmFkcGBrwSnZqISQK9t16W6',4,'Universidad Tecnológica del Perú','estudiante','2025-05-05 20:17:17','U0000009',1,'','');
/*!40000 ALTER TABLE `usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-06-04 22:27:38
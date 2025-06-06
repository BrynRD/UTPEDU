# UTPEDU 📚
<img src="frontend/public/img/logou.png" alt="Logo" width="250">

## Tabla de Contenidos
- [Descripción](#descripción)
- [Capturas](#capturas)
- [Instalación](#instalación)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Seguridad](#seguridad)

## Descripción
**UTPEDU** Es una plataforma web diseñada para la gestión de recursos educativos que incluye:
- Dashboard Admin
- Dashboard Estudiantes
- Dashboard Docentes

## Capturas

### Inicio 🏠
<img src="frontend/public/cap1.png" alt="Captura 1" width="800">

### Login 🔑
<img src="frontend/public/cap2.png" alt="Captura 2" width="800">

### Register ®️
<img src="frontend/public/cap3.png" alt="Captura 3" width="800">

### Dashboard Admin 📊
<img src="frontend/public/cap4.png" alt="Captura 4" width="800">

### Dashboard Alumno 📈
<img src="frontend/public/cap5.png" alt="Captura 5" width="800">

### Dashboard Docente 📝
<img src="frontend/public/cap6.png" alt="Captura 6" width="800">

## Instalación
Para instalar y ejecutar este proyecto localmente:

1. Clonar el repositorio:
```bash
git clone https://github.com/BrynRD/UTPEDU.git
cd UTPEDU
```

2. Configurar las credenciales de Google Drive:
   - Copia el archivo `google-credentials.example.json` a `google-credentials.json`
   - Reemplaza los valores de ejemplo con tus credenciales reales de Google Cloud Platform
   - **IMPORTANTE**: Nunca subas el archivo `google-credentials.json` al repositorio

3. Iniciar el proyecto con Docker:
```bash
docker-compose up --build
```

El comando anterior:
- Construirá las imágenes de Docker para el frontend y backend
- Instalará todas las dependencias necesarias
- Configurará la base de datos MySQL
- Iniciará todos los servicios

## Estructura del Proyecto
```
UTPEDU/
├── backend/           # API REST con Node.js
├── frontend/         # Aplicación Next.js
├── docker-compose.yml
└── README.md
```

## Variables de Entorno
Las variables de entorno están configuradas en el archivo `docker-compose.yml`. Si necesitas modificarlas, puedes hacerlo allí.

## Contribución
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## Seguridad
- Nunca subas credenciales o archivos sensibles al repositorio
- Mantén actualizadas las dependencias
- Sigue las mejores prácticas de seguridad en el código


# Manual del Sistema: Plataforma de Recursos Educativos

Este documento describe la arquitectura del sistema y proporciona instrucciones para configurar y ejecutar el proyecto utilizando Docker Compose en un entorno de desarrollo local.

## 1. Arquitectura del Sistema

La plataforma sigue una arquitectura Cliente-Servidor (N-tier) con los siguientes componentes principales:

*   **Cliente (Frontend):**
    *   Basado en **Next.js** y **React**.
    *   Se ejecuta en el navegador del usuario.
    *   Interactúa con el Backend a través de llamadas API.

*   **Servidor (Backend):**
    *   Desarrollado con **Node.js** y **Express**.
    *   Implementa la lógica de negocio, autenticación y acceso a datos.
    *   Sigue una estructura similar a MVC (Model-View-Controller).
    *   Se comunica con la base de datos y servicios externos (Google Drive).

*   **Base de Datos:**
    *   Se utiliza **MySQL** (o compatible como MariaDB).
    *   Almacena información sobre usuarios, recursos, categorías, etc.

*   **Servicios Externos:**
    *   Integración con **Google Drive** para el almacenamiento de archivos de recursos.

En el entorno Dockerizado, cada uno de estos componentes (Frontend, Backend, Base de Datos) corre en su propio contenedor Docker.

## 2. Prerrequisitos

Para configurar y ejecutar el proyecto localmente usando Docker, necesitas tener instalado lo siguiente:

*   **Docker Desktop:** Incluye Docker Engine y Docker Compose.
    *   [Descargar Docker Desktop](https://www.docker.com/products/docker-desktop/)

## 3. Configuración del Entorno de Desarrollo (con Docker Compose)

Sigue estos pasos para levantar la aplicación completa:

1.  **Clonar el Repositorio:**
    Si aún no lo has hecho, clona el código fuente del proyecto.

2.  **Configuración de Credenciales de Google Drive:**
    *   Asegúrate de tener tu archivo de credenciales de Google API (`google-credentials.json`).
    *   Coloca este archivo en el directorio `backend/config/`.

3.  **Configuración del ID de Carpeta de Google Drive:**
    *   Identifica el ID de la carpeta en Google Drive donde se almacenarán los recursos. Este ID es parte de la URL de la carpeta en Google Drive.
    *   Abre el archivo `docker-compose.yml` en la raíz del proyecto.
    *   Busca el servicio `backend`.
    *   Dentro de la sección `environment` del servicio `backend`, asegúrate de que la variable `GOOGLE_DRIVE_FOLDER_ID` esté configurada con el ID de tu carpeta. Por ejemplo:
        ```yaml
        services:
          backend:
            # ... otras configuraciones ...
            environment:
              # ... otras variables de entorno de BD ...
              GOOGLE_DRIVE_FOLDER_ID: <TU_GOOGLE_DRIVE_FOLDER_ID>
            # ... otras configuraciones ...
        ```
    *   Reemplaza `<TU_GOOGLE_DRIVE_FOLDER_ID>` con el ID real de tu carpeta.

4.  **Configuración de la Base de Datos Inicial:**
    *   Asegúrate de que el archivo `backend/migrations/init.sql` contenga el script SQL completo para crear todas las tablas de la base de datos (usuarios, categorias, recursos, roles, colecciones, etc.) y los datos iniciales necesarios.

5.  **Levantar los Contenedores con Docker Compose:**
    *   Abre una terminal en la raíz de tu proyecto (donde se encuentra `docker-compose.yml`).
    *   Ejecuta el siguiente comando:
        ```bash
        docker-compose up --build -d
        ```
        *   `up`: Inicia los servicios definidos en `docker-compose.yml`.
        *   `--build`: Reconstruye las imágenes Docker si hay cambios en los Dockerfiles o en el código que se copia.
        *   `-d`: Ejecuta los contenedores en modo "detached" (segundo plano), liberando tu terminal.

    *   La primera vez que ejecutes este comando, Docker descargará las imágenes base, construirá las imágenes de tu frontend y backend, creará una red, volúmenes y contenedores, e inicializará la base de datos ejecutando el script `init.sql`. Esto puede tardar varios minutos.

6.  **Verificar que los Contenedores Están Corriendo:**
    *   Puedes usar el siguiente comando para ver el estado de los servicios:
        ```bash
        docker-compose ps
        ```
    *   Todos los servicios (`backend`, `frontend`, `mysql`) deberían mostrar un estado como `Up`.

## 4. Ejecutando la Aplicación

Una vez que los contenedores estén corriendo:

*   **Frontend:** Accede a la aplicación en tu navegador a través de:
    ```
    http://localhost:3000
    ```

*   **Backend API:** La API del backend es accesible (principalmente para comunicación interna desde el frontend o para pruebas directas) en:
    ```
    http://localhost:3001/api
    ```

*   **Base de Datos (MySQL):** Si necesitas acceder directamente a la base de datos desde tu máquina local (usando un cliente MySQL como DBeaver, MySQL Workbench, etc.), puedes conectarte a:
    *   **Host:** `localhost` o `127.0.0.1`
    *   **Puerto:** `3307` (Según la configuración actual en `docker-compose.yml` para evitar conflictos con una instalación local de MySQL)
    *   **Usuario:** `root`
    *   **Contraseña:** `root`
    *   **Base de Datos:** `utpedu`

## 5. Gestión de Contenedores

*   **Ver Logs:** Para ver la salida de los contenedores (útil para depurar):
    ```bash
    docker-compose logs
    ```
    Para seguir los logs en tiempo real:
    ```bash
    docker-compose logs -f
    ```
    Para ver logs de un servicio específico (ej. backend):
    ```bash
    docker-compose logs backend
    ```

*   **Detener Contenedores:** Para detener todos los servicios (manteniendo los datos de la BD en el volumen):
    ```bash
    docker-compose down
    ```

*   **Detener y Eliminar Contenedores, Redes y Volúmenes:** Para detener todo y eliminar los datos persistentes de la base de datos (útil para empezar con una BD limpia):
    ```bash
    docker-compose down -v
    ```

*   **Ejecutar Comandos dentro de un Contenedor:** Para ejecutar un comando temporalmente dentro de un contenedor en ejecución (ej. cliente MySQL en el contenedor mysql):
    ```bash
    docker-compose exec mysql mysql -u root -proot utpedu
    ```

## 6. Solución de Problemas Comunes

*   **`Error: connect ECONNREFUSED`:** El backend no puede conectar a la base de datos. Asegúrate de que el contenedor `mysql` esté corriendo y revisa los logs de `backend` y `mysql` (`docker-compose logs -f`). Podría ser un problema de timing (la base de datos tarda en estar lista) o de configuración de conexión.
*   **`Address already in use`:** Un puerto (`3000`, `3001` o `3307`) ya está siendo usado por otro proceso en tu máquina. Detén el otro proceso o cambia los puertos en `docker-compose.yml`.
*   **`Table 'utpedu.<nombre_tabla>' doesn't exist`:** La base de datos no se inicializó correctamente con el script `init.sql` completo. Asegúrate de que `backend/migrations/init.sql` contiene el script completo y ejecuta `docker-compose down -v` seguido de `docker-compose up --build` para empezar con una base de datos limpia.
*   **`MulterError: File too large` o Contenedor del Backend se Cierra con Código 137:** El archivo subido excede el límite de Multer o el backend se queda sin memoria. Asegúrate de que Multer usa `diskStorage` y que el límite de tamaño es adecuado en `backend/middlewares/upload.js`.
*   **Problemas con Google Drive:** Verifica que el archivo `google-credentials.json` está en `backend/config/` y que la variable de entorno `GOOGLE_DRIVE_FOLDER_ID` está configurada correctamente en `docker-compose.yml` para el servicio `backend`. Revisa los logs del backend para errores específicos de Google Drive.

---

Este manual cubre la configuración y ejecución básica del proyecto con Docker Compose para desarrollo. Para la configuración en entornos de producción, se requerirían pasos adicionales y configuraciones de seguridad. 
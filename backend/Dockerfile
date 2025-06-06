# Usar una imagen base de Node.js
FROM node:20-slim

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar package.json y package-lock.json para instalar dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Exponer el puerto en el que corre la aplicación Express
EXPOSE 3001

# Comando para iniciar la aplicación
CMD [ "node", "app.js" ] 
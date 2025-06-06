# Usar una imagen base de Node.js para construir la aplicación
FROM node:20-alpine AS builder

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install --legacy-peer-deps

# Copiar el resto del código de la aplicación
COPY . .

# Construir la aplicación Next.js
RUN npm run build

# --- Fase de Producción --- 
# Usar una imagen base más ligera para la ejecución
FROM node:20-alpine

# Establecer el directorio de trabajo
WORKDIR /app

# Copiar los archivos de la fase de construcción
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public

# Exponer el puerto por defecto de Next.js en producción
EXPOSE 3000

# Comando para iniciar la aplicación en producción
CMD [ "npm", "start" ] 
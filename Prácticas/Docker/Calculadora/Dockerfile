# Usamos la imagen oficial de Node.js LTS
FROM node:20-alpine

# Establecemos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package.json .
COPY package-lock.json .

# Instalamos las dependencias
RUN npm install

# Copiamos todo el proyecto al contenedor
COPY . .

# Exponemos el puerto que usa la app
EXPOSE 8080

# Comando para ejecutar la app
CMD ["node", "app.js"]

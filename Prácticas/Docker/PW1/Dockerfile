# Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copiar package.json y package-lock (si existe)
COPY package*.json ./

RUN npm install --production

# Copiar código
COPY . .

# Exponer puerto interno (la app escucha en 3000)
EXPOSE 3000

CMD ["node", "app.js"]

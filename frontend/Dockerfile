# FASE 1: Construcción del frontend
FROM node:20-slim AS builder

# Instalar dependencias necesarias para compilar si alguna lo requiere
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copiar solo archivos necesarios para instalar dependencias
COPY package.json package-lock.json ./

# Instalar dependencias
RUN npm ci

# Copiar el resto del código fuente
COPY . .

# Build de la app en modo producción
RUN npm run build -- --mode production

# FASE 2: Nginx para servir archivos
FROM nginx:alpine

# Copiar archivos generados
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración personalizada para SPA
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

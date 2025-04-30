# FASE 1: build del proyecto
FROM node:18-alpine AS builder

WORKDIR /app
COPY package.json ./
RUN npm install
COPY . . 
RUN npm run build -- --mode production

# FASE 2: servir contenido con nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración para SPA (single page app)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

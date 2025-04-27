# Usa Amazon Corretto como base
FROM amazoncorretto:17-alpine

# Configura el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo JAR generado por Maven
COPY target/backend-0.0.1-SNAPSHOT.jar /app/app.jar

# Crea la carpeta de uploads dentro del contenedor
RUN mkdir -p /uploads

# Opcional: Da permisos de escritura completos a uploads (depende si quieres más seguridad o no)
RUN chmod -R 777 /uploads

# Expone el puerto 8080
EXPOSE 8080

# Comando para ejecutar la aplicación
RUN chmod +x /app/app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
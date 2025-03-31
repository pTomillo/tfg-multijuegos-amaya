FROM amazoncorretto:17-alpine

# Configura el directorio de trabajo en el contenedor
WORKDIR /app

# Copia el archivo JAR generado por Maven  lo renombra para evitar problemas
COPY target/backend-0.0.1-SNAPSHOT.jar /app/app.jar

# Expone el puerto 8080
EXPOSE 8080

# Comando para ejecutar la aplicación
RUN chmod +x /app/app.jar
ENTRYPOINT ["java", "-jar", "/app/app.jar"]

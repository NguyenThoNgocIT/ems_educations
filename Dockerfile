# stage 1: Build
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN if [ -f backend/mvnw ]; then \
        cd backend; \
    fi && \
    chmod +x ./mvnw && \
    ./mvnw clean package -DskipTests && \
    cp target/*.jar /app/app.jar

# stage 2: Run
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -Dserver.port=${PORT:-8080} -jar app.jar"]
 

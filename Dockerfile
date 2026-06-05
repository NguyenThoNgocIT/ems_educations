# stage 1: Build
FROM maven:3.9.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY backend/pom.xml backend/pom.xml
COPY backend/src backend/src
WORKDIR /app/backend
RUN mvn clean package -DskipTests && \
    cp target/*.jar /app/app.jar

# stage 2: Run
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -Xmx300m -Xms128m -XX:MaxMetaspaceSize=150m -XX:+UseSerialGC -Xss512k -XX:+UseContainerSupport -Dserver.port=${PORT:-8080} -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-prod} -jar app.jar"]

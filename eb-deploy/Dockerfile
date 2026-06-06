# Lightweight Dockerfile for Elastic Beanstalk
# JAR must be pre-built locally before creating the deployment zip
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["sh", "-c", "java -Xmx300m -Xms128m -XX:MaxMetaspaceSize=150m -XX:+UseSerialGC -Xss512k -XX:+UseContainerSupport -Dserver.port=${PORT:-8080} -Dspring.profiles.active=${SPRING_PROFILES_ACTIVE:-prod} -jar app.jar"]

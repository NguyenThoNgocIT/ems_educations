FROM maven:3.8.5-openjdk-17-slim AS build
WORKDIR /app
# Copy toàn bộ vào /app
COPY . .
# Chạy build từ thư mục backend
RUN cd backend && chmod +x ./mvnw && ./mvnw clean package -DskipTests

# Chạy ứng dụng
FROM openjdk:17-jdk-slim
WORKDIR /app
# Copy file jar từ stage build
COPY --from=build /app/backend/target/*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]

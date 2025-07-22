# ✅ 1단계: Build
FROM gradle:8.5-jdk17-alpine AS build
WORKDIR /app
COPY . .
WORKDIR /app/backend/kickauction
RUN gradle build -x test

# ✅ 2단계: Run
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/backend/kickauction/build/libs/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn package -DskipTests

FROM quay.io/quarkus/quarkus-jvm:2.16.6-final
WORKDIR /work/
COPY --from=build /app/target/quarkus-app .
CMD ["java", "-jar", "quarkus-run.jar"]
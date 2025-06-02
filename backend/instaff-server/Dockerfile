FROM maven:3.9.4-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn package -DskipTests

FROM quay.io/quarkus/quarkus-distroless-image:2.0
WORKDIR /work/
COPY --from=build /app/target/quarkus-app .
CMD ["java", "-jar", "quarkus-run.jar"]


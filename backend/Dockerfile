FROM eclipse-temurin:17-jdk-jammy AS builder

WORKDIR /app

RUN apt-get update && apt-get install -y maven

COPY . .

RUN chmod +x mvnw
RUN mvn clean package -DskipTests

FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8083

CMD ["java", "-jar", "app.jar"]
# ---------------- BACKEND BUILD ----------------
FROM eclipse-temurin:17-jdk-jammy AS backend-builder
WORKDIR /build/backend

RUN apt-get update && apt-get install -y maven

COPY backend/pom.xml .
RUN mvn dependency:go-offline

COPY backend/ .
RUN mvn clean package -DskipTests


# ---------------- FINAL RUNTIME IMAGE ----------------
FROM eclipse-temurin:17-jdk-jammy

# Install tools + Node 18 (NodeSource)
RUN apt-get update && apt-get install -y curl supervisor mysql-server \
 && curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
 && apt-get install -y nodejs \
 && rm -rf /var/lib/apt/lists/*

# ---------------- FRONTEND SETUP ----------------
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ .

# ---------------- MYSQL SETUP ----------------
RUN mkdir -p /var/run/mysqld \
 && chown -R mysql:mysql /var/run/mysqld \
 && chown -R mysql:mysql /var/lib/mysql

# ---------------- BACKEND JAR ----------------
WORKDIR /app/backend
COPY --from=backend-builder /build/backend/target/*.jar app.jar

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 8083 5173 3306

CMD ["/usr/bin/supervisord", "-n"]

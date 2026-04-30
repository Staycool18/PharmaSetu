#!/bin/bash
set -e

echo "=== after_install.sh started ==="

# Create required directories
sudo mkdir -p /opt/pharmasetu/backend
sudo mkdir -p /opt/pharmasetu/logs
sudo mkdir -p /var/www/pharmasetu

# Log to file and stdout so CodeDeploy lifecycle logs show errors (not only after_install.log on disk).
exec > >(tee -a /opt/pharmasetu/logs/after_install.log) 2>&1

# Install Java 17 if not present
if ! command -v java &> /dev/null; then
    echo "Installing Java 17..."
    sudo yum install -y java-17-amazon-corretto
else
    echo "Java already installed"
    # Corretto/OpenJDK convention: java -version prints to stderr and exits 1 even on success.
    java -version 2>&1 || true
fi

# Install nginx if not present
# Amazon Linux 2: nginx is not in default yum repos — use Extras ("nginx1").
# Amazon Linux 2023: package is typically named nginx in dnf/yum.
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    if command -v amazon-linux-extras &> /dev/null; then
        sudo amazon-linux-extras install nginx1 -y
    elif command -v dnf &> /dev/null; then
        sudo dnf install -y nginx
    else
        sudo yum install -y nginx
    fi
else
    echo "nginx already installed"
fi

# Optional RDS / env override (merged with JAR defaults; see Spring additional-location below)
if [ -f /etc/pharmasetu/application.properties ]; then
    echo "Copying external datasource override..."
    sudo cp /etc/pharmasetu/application.properties /opt/pharmasetu/backend/application-override.properties
else
    echo "No /etc/pharmasetu/application.properties (using JAR defaults only)"
fi

# Find deployed JAR (robust)
JAR_FILE=$(find /opt/pharmasetu/backend -name "*.jar" | head -1)

if [ -z "$JAR_FILE" ]; then
    echo "ERROR: No JAR file found in /opt/pharmasetu/backend/"
    ls -la /opt/pharmasetu/backend/
    exit 1
fi

echo "Found JAR: $JAR_FILE"

# Configure nginx (remove stock default — it uses default_server and keeps serving
# "Welcome to nginx" even when this file exists, because alphabetically default.conf wins.)
sudo rm -f /etc/nginx/conf.d/default.conf

cat << 'EOF' | sudo tee /etc/nginx/conf.d/pharmasetu.conf
server {
    listen 80 default_server;
    server_name _;

    root /var/www/pharmasetu;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api/ {
        proxy_pass http://localhost:8083/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

echo "nginx configured"

# Create systemd service
cat << EOF | sudo tee /etc/systemd/system/pharmasetu-backend.service
[Unit]
Description=PharmaSetu Spring Boot Backend
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/opt/pharmasetu/backend
ExecStart=/usr/bin/java -jar ${JAR_FILE} --spring.config.additional-location=optional:file:/opt/pharmasetu/backend/application-override.properties
SuccessExitStatus=143
StandardOutput=append:/opt/pharmasetu/logs/backend.log
StandardError=append:/opt/pharmasetu/logs/backend-error.log
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo "systemd service created"

# Set permissions
sudo chown -R ec2-user:ec2-user /opt/pharmasetu
sudo chown -R ec2-user:ec2-user /var/www/pharmasetu

# Reload systemd
sudo systemctl daemon-reload

echo "=== after_install.sh completed ==="
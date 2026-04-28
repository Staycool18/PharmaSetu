#!/bin/bash
set -e

# Ensure log directory exists FIRST
mkdir -p /opt/pharmasetu/logs

# Redirect logs AFTER directory exists
exec > /opt/pharmasetu/logs/after_install.log 2>&1

echo "=== after_install.sh started ==="

# Install Java 17 if not present
if ! command -v java &> /dev/null; then
    echo "Installing Java 17..."
    sudo yum install -y java-17-amazon-corretto
else
    echo "Java already installed"
    java -version
fi

# Install nginx if not present
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    sudo yum install -y nginx
else
    echo "nginx already installed"
fi

# Ensure backend directory exists
mkdir -p /opt/pharmasetu/backend

# OPTIONAL: Handle application.properties safely
if [ -f /etc/pharmasetu/application.properties ]; then
    echo "Copying application.properties..."
    cp /etc/pharmasetu/application.properties /opt/pharmasetu/backend/application.properties
else
    echo "WARNING: application.properties not found, skipping..."
fi

# Find the deployed JAR
JAR_FILE=$(ls /opt/pharmasetu/backend/*.jar 2>/dev/null | head -1)

if [ -z "$JAR_FILE" ]; then
    echo "ERROR: No JAR file found in /opt/pharmasetu/backend/"
    ls -la /opt/pharmasetu/backend/
    exit 1
fi

echo "Found JAR: $JAR_FILE"

# Configure nginx
sudo mkdir -p /var/www/pharmasetu

cat << 'EOF' | sudo tee /etc/nginx/conf.d/pharmasetu.conf
server {
    listen 80;
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

echo "nginx config written"

# Create systemd service
cat << EOF | sudo tee /etc/systemd/system/pharmasetu-backend.service
[Unit]
Description=PharmaSetu Spring Boot Backend
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/opt/pharmasetu/backend
ExecStart=/usr/bin/java -jar ${JAR_FILE} --spring.config.location=/opt/pharmasetu/backend/application.properties
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
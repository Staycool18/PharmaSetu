#!/bin/bash
exec > /opt/pharmasetu/logs/after_install.log 2>&1
set -e

echo "=== after_install.sh started ==="

# Install Java 17 if not present
if ! command -v java &> /dev/null; then
    echo "Installing Java 17..."
    yum install -y java-17-amazon-corretto
else
    echo "Java already installed: $(java -version 2>&1)"
fi

# Install nginx if not present
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    yum install -y nginx
else
    echo "nginx already installed"
fi

# Copy application.properties
if [ -f /etc/pharmasetu/application.properties ]; then
    echo "Copying application.properties..."
    cp /etc/pharmasetu/application.properties /opt/pharmasetu/backend/application.properties
else
    echo "ERROR: /etc/pharmasetu/application.properties not found!"
    exit 1
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
cat > /etc/nginx/conf.d/pharmasetu.conf << 'EOF'
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

# Create systemd service using the actual JAR filename
cat > /etc/systemd/system/pharmasetu-backend.service << EOF
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
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF
echo "systemd service written"

# Set permissions
chown -R ec2-user:ec2-user /opt/pharmasetu
chown -R ec2-user:ec2-user /var/www/pharmasetu

systemctl daemon-reload
echo "=== after_install.sh completed ==="

#!/bin/bash
set -e

# Install Java 17 if not present
if ! java -version 2>&1 | grep -q "17"; then
    yum install -y java-17-amazon-corretto
fi

# Install nginx if not present
if ! command -v nginx &> /dev/null; then
    yum install -y nginx
fi

# Copy application.properties from manually placed config on EC2
# Place your application.properties at /etc/pharmasetu/application.properties on the EC2 instance once manually
if [ -f /etc/pharmasetu/application.properties ]; then
    cp /etc/pharmasetu/application.properties /opt/pharmasetu/backend/application.properties
else
    echo "WARNING: /etc/pharmasetu/application.properties not found. Backend may fail to start."
fi

# Configure nginx to serve frontend and proxy backend
cat > /etc/nginx/conf.d/pharmasetu.conf << 'EOF'
server {
    listen 80;
    server_name _;

    # Serve React frontend
    root /var/www/pharmasetu;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls to Spring Boot backend
    location /api/ {
        proxy_pass http://localhost:8083/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
EOF

# Create systemd service for Spring Boot backend
cat > /etc/systemd/system/pharmasetu-backend.service << 'EOF'
[Unit]
Description=PharmaSetu Spring Boot Backend
After=network.target

[Service]
User=ec2-user
WorkingDirectory=/opt/pharmasetu/backend
ExecStart=/usr/bin/java -jar /opt/pharmasetu/backend/Medic-0.0.1-SNAPSHOT.jar \
  --spring.config.location=/opt/pharmasetu/backend/application.properties
SuccessExitStatus=143
StandardOutput=append:/opt/pharmasetu/logs/backend.log
StandardError=append:/opt/pharmasetu/logs/backend-error.log
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Set permissions
chown -R ec2-user:ec2-user /opt/pharmasetu
chown -R ec2-user:ec2-user /var/www/pharmasetu

systemctl daemon-reload

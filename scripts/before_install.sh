#!/bin/bash
exec > /opt/pharmasetu/logs/before_install.log 2>&1
set -e

echo "=== before_install.sh started ==="

# Create directories first
mkdir -p /opt/pharmasetu/backend
mkdir -p /opt/pharmasetu/logs
mkdir -p /var/www/pharmasetu

# Stop backend if running
if systemctl is-active --quiet pharmasetu-backend; then
    echo "Stopping pharmasetu-backend..."
    systemctl stop pharmasetu-backend
else
    echo "pharmasetu-backend not running, skipping stop"
fi

# Stop nginx if running
if systemctl is-active --quiet nginx; then
    echo "Stopping nginx..."
    systemctl stop nginx
else
    echo "nginx not running, skipping stop"
fi

# Clean old files
rm -f /opt/pharmasetu/backend/*.jar
rm -rf /var/www/pharmasetu/*

echo "=== before_install.sh completed ==="

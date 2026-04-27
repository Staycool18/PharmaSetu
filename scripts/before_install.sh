#!/bin/bash
set -e

# Stop backend if running
if systemctl is-active --quiet pharmasetu-backend; then
    systemctl stop pharmasetu-backend
fi

# Stop nginx if running
if systemctl is-active --quiet nginx; then
    systemctl stop nginx
fi

# Clean old files
rm -f /opt/pharmasetu/backend/*.jar
rm -rf /var/www/pharmasetu/*

# Ensure directories exist
mkdir -p /opt/pharmasetu/backend
mkdir -p /var/www/pharmasetu
mkdir -p /opt/pharmasetu/logs

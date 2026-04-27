#!/bin/bash
exec > /opt/pharmasetu/logs/start.log 2>&1
set -e

echo "=== start.sh started ==="

# Start backend
echo "Starting pharmasetu-backend..."
systemctl enable pharmasetu-backend
systemctl start pharmasetu-backend

# Wait for backend to come up
echo "Waiting for backend to start..."
sleep 15

# Check backend is running
if systemctl is-active --quiet pharmasetu-backend; then
    echo "Backend started successfully"
else
    echo "ERROR: Backend failed to start"
    journalctl -u pharmasetu-backend --no-pager -n 50
    exit 1
fi

# Start nginx
echo "Starting nginx..."
systemctl enable nginx
systemctl start nginx

if systemctl is-active --quiet nginx; then
    echo "nginx started successfully"
else
    echo "ERROR: nginx failed to start"
    journalctl -u nginx --no-pager -n 20
    exit 1
fi

echo "=== start.sh completed ==="

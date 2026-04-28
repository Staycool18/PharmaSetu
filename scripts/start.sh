#!/bin/bash
set -e

# Ensure log directory exists
sudo mkdir -p /opt/pharmasetu/logs

# Redirect logs
exec > /opt/pharmasetu/logs/start.log 2>&1

echo "=== start.sh started ==="

# Reload systemd (only needed if service file changed)
sudo systemctl daemon-reload

# Start backend
echo "Starting backend..."
sudo systemctl enable pharmasetu-backend
sudo systemctl restart pharmasetu-backend

echo "Waiting for backend to boot..."
sleep 12

# Check backend status
if systemctl is-active --quiet pharmasetu-backend; then
    echo "Backend started successfully"
else
    echo "ERROR: Backend failed to start"
    journalctl -u pharmasetu-backend --no-pager -n 50
    exit 1
fi

# Start nginx
echo "Starting nginx..."
sudo systemctl enable nginx
sudo systemctl restart nginx

# Check nginx status
if systemctl is-active --quiet nginx; then
    echo "nginx started successfully"
else
    echo "ERROR: nginx failed to start"
    journalctl -u nginx --no-pager -n 30
    exit 1
fi

echo "=== All services started successfully ==="
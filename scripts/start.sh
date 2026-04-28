#!/bin/bash
set -e

mkdir -p /opt/pharmasetu/logs
exec > /opt/pharmasetu/logs/start.log 2>&1

echo "=== Starting services ==="

# Reload systemd
sudo systemctl daemon-reload

# Start backend (DON'T fail deployment if it crashes)
echo "Starting backend..."
sudo systemctl restart pharmasetu-backend || echo "Backend restart failed"

sleep 10

if systemctl is-active --quiet pharmasetu-backend; then
  echo "Backend is running"
else
  echo "WARNING: Backend is NOT running (deployment will continue)"
  journalctl -u pharmasetu-backend -n 20 --no-pager
fi

# Start nginx
echo "Starting nginx..."
sudo systemctl restart nginx

if systemctl is-active --quiet nginx; then
  echo "nginx is running"
else
  echo "WARNING: nginx failed to start"
  journalctl -u nginx -n 20 --no-pager
fi

echo "=== Deployment completed ==="
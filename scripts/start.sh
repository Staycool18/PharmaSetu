#!/bin/bash
set -e

exec > /opt/pharmasetu/logs/start.log 2>&1

echo "Starting services..."

# Restart backend safely
sudo systemctl daemon-reload
sudo systemctl restart pharmasetu-backend

sleep 10

sudo systemctl is-active --quiet pharmasetu-backend || {
  echo "Backend failed"
  journalctl -u pharmasetu-backend -n 50
  exit 1
}

echo "Backend OK"

# Restart nginx safely
sudo systemctl restart nginx

sudo systemctl is-active --quiet nginx || {
  echo "nginx failed"
  journalctl -u nginx -n 30
  exit 1
}

echo "All services started successfully"
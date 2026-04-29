#!/bin/bash
exec > /opt/pharmasetu/logs/validate.log 2>&1
set -e

echo "=== validate_service.sh started ==="

# Check backend
if systemctl is-active --quiet pharmasetu-backend; then
    echo "Backend is running"
else
    echo "WARNING: Backend is NOT running (deployment will continue)"
    journalctl -u pharmasetu-backend -n 20 --no-pager
fi

# Check nginx
if systemctl is-active --quiet nginx; then
    echo "nginx is running"
else
    echo "WARNING: nginx is NOT running"
fi

# Optional health check (public permitAll endpoint; actuator not enabled in this app)
sleep 5
if curl -sf http://localhost:8083/medicine/all > /dev/null 2>&1; then
    echo "Backend health check passed"
else
    echo "WARNING: Backend API not reachable on /medicine/all"
fi

echo "=== validate_service.sh completed ==="
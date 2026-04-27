#!/bin/bash
exec > /opt/pharmasetu/logs/validate.log 2>&1
set -e

echo "=== validate_service.sh started ==="

# Check backend is running
if ! systemctl is-active --quiet pharmasetu-backend; then
    echo "ERROR: pharmasetu-backend is not running"
    journalctl -u pharmasetu-backend --no-pager -n 50
    exit 1
fi
echo "Backend is running"

# Check nginx is running
if ! systemctl is-active --quiet nginx; then
    echo "ERROR: nginx is not running"
    exit 1
fi
echo "nginx is running"

# Wait and check backend HTTP health
sleep 5
if curl -sf http://localhost:8083/actuator/health > /dev/null 2>&1; then
    echo "Backend health check passed"
else
    echo "WARNING: Backend health endpoint not reachable (may not have actuator, continuing...)"
fi

echo "=== validate_service.sh completed ==="

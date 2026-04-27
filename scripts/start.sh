#!/bin/bash
set -e

# Start Spring Boot backend
systemctl enable pharmasetu-backend
systemctl start pharmasetu-backend

# Start nginx to serve frontend
systemctl enable nginx
systemctl start nginx

echo "PharmaSetu backend and frontend started successfully"

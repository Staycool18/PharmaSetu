#!/bin/bash
set -e

# Update system
yum update -y

# Install Java 17
yum install -y java-17-amazon-corretto

# Install nginx
yum install -y nginx

# Install CodeDeploy agent
yum install -y ruby wget
cd /home/ec2-user
wget https://aws-codedeploy-ap-south-1.s3.ap-south-1.amazonaws.com/latest/install
chmod +x ./install
./install auto
systemctl enable codedeploy-agent
systemctl start codedeploy-agent

# Create app directories
mkdir -p /opt/pharmasetu/backend
mkdir -p /opt/pharmasetu/logs
mkdir -p /var/www/pharmasetu
mkdir -p /etc/pharmasetu

# Set ownership
chown -R ec2-user:ec2-user /opt/pharmasetu
chown -R ec2-user:ec2-user /var/www/pharmasetu

# Place your application.properties manually after instance is running:
# sudo nano /etc/pharmasetu/application.properties

# Enable nginx on boot
systemctl enable nginx

#!/bin/bash

set -e

# Configure sudoers
echo "$(whoami) ALL=(ALL) NOPASSWD: /usr/bin/chown" | sudo tee -a /etc/sudoers
echo "$(whoami) ALL=(ALL) NOPASSWD: /usr/bin/su" | sudo tee -a /etc/sudoers
echo "$(whoami) ALL=(ALL) NOPASSWD: /usr/bin/rm" | sudo tee -a /etc/sudoers

# Update and install dependencies
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# Configure Node.js repository
curl -s https://deb.nodesource.com/setup_18.x | sudo bash

# Install Node.js
sudo apt-get install nodejs -y

# Install Nginx, Docker, and Docker Compose
sudo apt-get install nginx docker.io docker-compose redis-server -y
sudo usermod -aG docker $USER

# Intall pm2 for server startups
sudo npm install -g pm2

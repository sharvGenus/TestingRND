#!/bin/bash

set -e

# Ensure a domain name is provided as an argument, otherwise stop execution
if [ "$#" -eq 0 ]; then
    echo "Provide domain names!"
    exit 1
else
    genus_wfm_domain=$1
    reports_domain_name=$2
fi

if [ -z "${genus_wfm_domain}" ]; then
    echo "Provide a valid domain name for genus wfm!"
    exit 1
fi

if [ -z "${reports_domain_name}" ]; then
    echo "Provide a valid domain name for reports!"
    exit 1
fi

# Start Nginx Load Balancer
sudo systemctl start nginx

# Enable Nginx service to start on system boot
sudo systemctl enable nginx

# Change the server name in the config file with the given domain name
# Use double quotes to allow variable expansion
sed -i "s/genus_wfm_domain/$genus_wfm_domain/g" genus-wfm-nginx.conf
sed -i "s/reports_domain_name/$reports_domain_name/g" genus-wfm-nginx.conf

# Erase old config for same domain
sudo rm -f /etc/nginx/sites-enabled/$genus_wfm_domain

# Copy Nginx Configuration File and create a symbolic link
sudo ln -s /srv/genus-wfm/genus-wfm-nginx.conf /etc/nginx/sites-enabled/$genus_wfm_domain

# Restart Nginx Service
sudo systemctl restart nginx

# Display a message indicating successful configuration
echo "Nginx configuration for $genus_wfm_domain updated successfully."
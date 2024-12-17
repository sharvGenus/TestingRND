#!/bin/bash

set -e

# Read database name from .env file
DB_NAME=$(grep "^DB_NAME" backend/.env | cut -d '=' -f2)

# Update and install dependencies
sudo apt-get update

# Configure PostgreSQL repository and install PostgreSQL 16
sudo sh -c 'echo "deb https://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get -y install postgresql-16 postgresql-contrib-16 pgbouncer
sudo systemctl status postgresql

# Create default database
echo "psql -c 'CREATE DATABASE $DB_NAME;'"

# Update default password for postgres user
sudo su postgres <<EOF
    # Run the psql command to change the password
    psql -c 'CREATE DATABASE $DB_NAME;';
    psql -c "ALTER ROLE postgres WITH PASSWORD 'postgres';"
EOF

# Configure PgBouncer
sudo bash -c 'cat > /etc/pgbouncer/pgbouncer.ini <<EOF
[databases]
*=host=localhost user=postgres port=5432

[pgbouncer]
listen_addr = 0.0.0.0
listen_port = 6432
auth_type = md5
auth_file = /etc/pgbouncer/userlist.txt
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 20
logfile = /var/log/postgresql/pgbouncer.log
pidfile = /var/run/postgresql/pgbouncer.pid
admin_users = postgres
stats_users = postgres
ignore_startup_parameters = extra_float_digits
EOF'

# Create the userlist.txt file for PgBouncer authentication
sudo bash -c 'cat > /etc/pgbouncer/userlist.txt <<EOF
"postgres" "md52bb80d537b1da3e38bd30361aa855686"
"postgres" "postgres"
EOF'

# Change ownership of the PgBouncer config files
sudo chown -R postgres:postgres /etc/pgbouncer

# Enable and start PgBouncer service
sudo systemctl stop pgbouncer.socket
sudo systemctl stop pgbouncer.service

sudo systemctl start pgbouncer.socket
sudo systemctl start pgbouncer.service
sudo systemctl enable pgbouncer.service

# Check the status of PgBouncer
# sudo systemctl status pgbouncer
# echo "PgBouncer setup completed successfully!"


# Commands to move old main file from secondary database and create new main file with replications
# sudo systemctl stop postgresql
# sudo mv /var/lib/postgresql/16/main /var/lib/postgresql/16/main_backup
# sudo su postgres -c "pg_basebackup -h primary_server_ip -D /var/lib/postgresql/16/main -U postgres -P -R"

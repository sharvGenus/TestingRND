#!/bin/bash

# Set the desired directory
DATA_DIR=$(pwd)

# Break execution on any error
set -e

# Execute the commands
docker system prune -f

docker run -d --network=host \
    -v "$DATA_DIR/metabase-data/metabase.db:/metabase.db" \
    -v "$DATA_DIR/metabase-data/data:/metabase-data" \
    --name metabase metabase/metabase

# Reset error handling
set +e

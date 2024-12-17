#!/bin/bash
set -e -o pipefail

# Check current owner of postgres_dump directory
directory="/srv/genus-wfm/backups"
postgresdumpdirectory="$directory/postgres_dump"
attachmentdumpdirectory="$directory/attachment_dump"
postgres_user="postgres"
host_name=$(hostname | tr '[:upper:]' '[:lower:]' | tr ' ' '_' | tr '-' '_')
postgresdumpfilename="${host_name}_genus_wfm"
attachmentdumpfilename="${host_name}_public"

# Default retention value
retention=$1

if [ -z "${retention}" ]; then
    retention=1
fi
echo "retention $retention"

# Change directory to /srv/genus-wfm/backups
cd "$directory"

current_owner=$(stat -c "%U" "$postgresdumpdirectory")

# If current user is not postgres then change ownership to postgres
if [[ "$current_owner" != "$postgres_user" ]]; then
  echo "Changing ownership of $postgresdumpdirectory to $postgres_user"
  sudo chown "$postgres_user:$postgres_user" "$postgresdumpdirectory"
else
  echo "The directory $postgresdumpdirectory already belongs to $postgres_user"
fi

# Get the current date in YYYYMMDD format
current_date=$(date +'%Y%m%d')

# Go to postgres dump directory to delete old files
cd "$postgresdumpdirectory"

# Set the start date to give retention days or 1 day ago.
start_date=$(date -d "$retention days ago" +%Y%m%d)
echo "start_date $start_date"

for file in "$postgresdumpdirectory"/*; do
  # Get the basename of the file
  filename=$(basename "$file")
  creation_date=$(stat -c %w "$file")
  creation_date=$(date -d "$creation_date" +%Y%m%d)

  # Print the filename and the date part
  if [ "$creation_date" -le "$start_date" ] && [ "$filename" != "genus_wfm.sql" ]; then
    echo "Deleting records $filename"
    sudo rm -rf $filename
  fi
done

# # Go to attachment dump directory to remove older dumps
cd "$attachmentdumpdirectory"

for file in "$attachmentdumpdirectory"/*; do
  # Get the basename of the file
  filename=$(basename "$file")
  creation_date=$(stat -c %w "$file")
  creation_date=$(date -d "$creation_date" +%Y%m%d)

  # Print the filename and the date part
  if [ "$creation_date" -le "$start_date" ] && [ "$filename" != "public.zip" ]; then
    echo "Deleting records $filename"
    sudo rm -rf $filename
  fi
done

# go back to backup directory
cd "$directory"

# Run the pg_dump command
sudo su postgres -c "pg_dump --file ${postgresdumpdirectory}/${postgresdumpfilename}_${current_date}.sql --username postgres --no-password --format=c --blobs --verbose genus_wfm"

# Change directory to /srv/genus-wfm/backend/public
cd /srv/genus-wfm/backend/public

# Create a zip archive
zip -r -9 "${attachmentdumpdirectory}/${attachmentdumpfilename}_${current_date}.zip" ./

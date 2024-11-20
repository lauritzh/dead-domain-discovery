#!/bin/bash

# Get the current date in YYYYMMDD format
CURRENT_DATE=$(date +"%Y%m%d")

# Name of the zip file with the current date
ZIP_FILE="dead_domain_discovery_$CURRENT_DATE.zip"

# List of files to include in the zip file based on the manifest
FILES=(
  "manifest.json"
  "content.js"
  "background.js"
  "popup.html"
  "popup.js"
  "options.html"
  "options.js"
  "icons/icon16.png"
  "icons/icon32.png"
  "icons/icon48.png"
  "icons/icon128.png"
)

# Remove the zip file if it already exists
if [ -f "$ZIP_FILE" ]; then
  rm "$ZIP_FILE"
fi

# Create a new zip file with the specified files
zip "$ZIP_FILE" "${FILES[@]}"

echo "Extension has been bundled into $ZIP_FILE"

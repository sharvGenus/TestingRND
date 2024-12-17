#!/bin/bash

# Extract the version number using cat, grep, and awk
version=$(cat package.json | grep -o '"version": *"[^"]*"' | awk -F ':' '{print $2}' | tr -d '"' | tr -d ' ')

echo "Version number: $version"
rm -rf node_modules
yarn install
cd android/.
./gradlew clean
./gradlew bundleRelease
cd ../
mkdir -p playStoreBuilds
mv android/app/build/outputs/bundle/release/app-release.aab playStoreBuilds/genus-wfm-$version.aab
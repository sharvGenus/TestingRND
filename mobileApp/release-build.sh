#!/bin/bash

VERSION=$(grep '"version"' package.json | sed -E 's/.*"version": "([^"]+)".*/\1/')

echo "creating release build with version: $VERSION"

rm -rf node_modules
yarn install
cd android/.
./gradlew clean
./gradlew assembleRelease
cd ../
mkdir -p releaseBuilds
mv android/app/build/outputs/apk/release/app-release.apk releaseBuilds/genus-wfm-release-$VERSION.apk

echo "Build created and can be found at releaseBuilds/genus-wfm-release-$VERSION.apk"
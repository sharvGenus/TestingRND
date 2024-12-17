#!/bin/bash
NEW_VERSION=$1
FILE="./android/app/build.gradle"

# Update versionName in build.gradle
sed -i '' -e "s/versionName \".*\"/versionName \"$NEW_VERSION\"/" $FILE

git add $FILE
git add package*
git commit -m "update version: $NEW_VERSION"
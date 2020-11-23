#!/bin/sh
set -e

if [ -z "$EMAIL" ]; then
  EMAIL="deploy-bot-noreply@noreply"
  echo "WARN! EMAIL not provided! Defaulting to $EMAIL"
fi

if [ -z "$USERNAME" ]; then
  USERNAME="deploy-bot"
  echo "WARN! USERNAME not provided! Defaulting to $USERNAME"
fi

SITE_DIR="docs/$GITHUB_RUN_NUMBER"
SOURCE_DIR="out/reports"

mkdir -p "$SITE_DIR"
cp -R "$SOURCE_DIR"/. "$SITE_DIR"

if [ -z "$(git status --porcelain)" ]; then
  echo "$LOG_PREFIX There are no changes to deploy"
else
  git config --local user.name "$USERNAME"
  git config --local user.email "$EMAIL"
  git add .
  git commit -m "Publish test reports"
  git push
fi

echo "Done"

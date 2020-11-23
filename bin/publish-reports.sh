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

if [ -z "$GH_PAGES_BRANCH" ]; then
  GH_PAGES_BRANCH="reports"
  echo "WARN! REPORTS_BRANCH not provided! Defaulting to $GH_PAGES_BRANCH"
fi

TEMP_SITE_DIR="$HOME/temp-gh-pages/$GITHUB_RUN_NUMBER"
SOURCE_DIR="out/reports"

# copy current reports content to a temp dir
rm -rf "$TEMP_SITE_DIR"
mkdir -p "$TEMP_SITE_DIR"
cp -R "$SOURCE_DIR"/. "$TEMP_SITE_DIR"

# checkout reports branch and prepare content
git fetch
git checkout $GH_PAGES_BRANCH
mkdir "$GITHUB_RUN_NUMBER"
cp -R "$TEMP_SITE_DIR"/. "$GITHUB_RUN_NUMBER"

# commit and push
if [ -z "$(git status --porcelain)" ]; then
  echo "$LOG_PREFIX There are no changes to deploy"
else
  git config --local user.name "$USERNAME"
  git config --local user.email "$EMAIL"
  git add .
  git commit -m "Publish test reports"
  git push
fi

echo "Done publishing reports"

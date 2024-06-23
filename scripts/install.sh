#!/bin/sh 
# cd to project root
cd "$(dirname "$0")"
cd ..
GREEN='\033[0;32m'
NC='\033[0m' 
DENO_PATH="$(which deno)"
if [ -z "$DENO_PATH" ]; then
  echo --- Deno not found. Please install Deno first and add it to your PATH.
  exit 1
fi
DENO_PATH_DIR="$(dirname "$DENO_PATH")"

./scripts/uninstall.sh

echo "${GREEN}--- Please visit https://suhas.url.lol/amss and then paste in the token that the page gives you (should start with xoxp-)${NC}"
printf "${GREEN}Token? ${NC}"
read slack_token
echo --- Copy launch agent plist
mkdir ~/Library/LaunchAgents/ || true
cp -f scripts/one.suhas.apple-music-slack.plist ~/Library/LaunchAgents/
echo --- Edit launch agent plist
# /usr/bin is for osascript
plutil -replace EnvironmentVariables.PATH -string "$DENO_PATH_DIR:/usr/bin" ~/Library/LaunchAgents/one.suhas.apple-music-slack.plist
plutil -replace WorkingDirectory -string "$(pwd)" ~/Library/LaunchAgents/one.suhas.apple-music-slack.plist
plutil -replace EnvironmentVariables.SLACK_TOKEN -string "$slack_token" ~/Library/LaunchAgents/one.suhas.apple-music-slack.plist
echo --- Load launch agent
launchctl load ~/Library/LaunchAgents/one.suhas.apple-music-slack.plist
echo --- INSTALL SUCCESS
#!/bin/sh 
echo --- Unload launch agent
launchctl unload ~/Library/LaunchAgents/one.suhas.apple-music-slack.plist
echo --- Remove launch agent plist
rm -f ~/Library/LaunchAgents/one.suhas.apple-music-slack.plist || true
echo --- UNINSTALL SUCCESS
# apple music but in slack

- heavily inspired by [NextFire/apple-music-discord-rpc](https://github.com/NextFire/apple-music-discord-rpc)

**Note**: this is for mac only (right now) since i'm using applescript

## Instructions
- install deno, and then run this
- ensure you read the instructions in the install script since you need to paste a slack token in for it to work
- the install script will set the status script as a login item (if you don't want that, put a SLACK_TOKEN obtained from https://suhas.url.lol/amms in .env and then just run the script as normal)
```
git clone https://github.com/tildezero/apple-music-slack-status
cd apple-music-slack-status/
chmod +x scripts/*.sh
chmod +x apple-music-slack-status.ts
./scripts/install.sh
```

### Uninstall
```
cd apple-music-slack-status/
./scripts/uninstall.sh
cd ../
rm -rf apple-music-slack-status/
```

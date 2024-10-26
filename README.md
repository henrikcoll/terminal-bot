# Terminal

A discord bot to control my pelican servers.

docker-compose.yaml
```
services:
  terminal:
    image: ghcr.io/henrikcoll/terminal-bot:latest
    environment:
      DISCORD_TOKEN: 'Your discord token'
      DISCORD_CLIENT_ID: 'Your discord client id'
      DISCORD_GUILD_ID: 'Your discord guild id'
      CTRL_CHANNEL_ID: 'Channel id for interface'
      PELICAN_API_KEY: 'Your pelican api key'
      PELICAN_URL: 'Url to pelican panel'
```

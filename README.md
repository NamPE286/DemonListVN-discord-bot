# DemonListVN-discord-bot

A Discord bot for DemonListVN with ping-pong command functionality.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Add your Discord bot token and client ID to the `.env` file:
   - Get your bot token from [Discord Developer Portal](https://discord.com/developers/applications)
   - Enable "Message Content Intent" in the Bot settings
   - Copy your bot token and client ID to `.env`

4. Build the TypeScript code:
```bash
npm run build
```

5. Run the bot:
```bash
npm start
```

For development with auto-compile:
```bash
npm run watch
```
Then in another terminal:
```bash
npm run dev
```

## Commands

- `!ping` - Test command that responds with "Pong!" and shows latency

## Bot Permissions Required

- Read Messages/View Channels
- Send Messages
- Message Content Intent (must be enabled in Discord Developer Portal)


import 'dotenv/config'

import { Client, GatewayIntentBits, Message } from "discord.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.on("ready", () => {
  console.log(`✅ Logged in as ${client.user?.tag}`);
});

client.on("messageCreate", async (message: Message) => {
  if (message.author.bot) {
    return;
  }

  if (message.content.toLowerCase() === "!ping") {
    const sent = await message.reply("Pong! 🏓");
    const latency = sent.createdTimestamp - message.createdTimestamp;
    await sent.edit(
      `Pong! 🏓\nLatency: ${latency}ms\nAPI Latency: ${Math.round(
        client.ws.ping
      )}ms`
    );
  }
});

client.login(process.env.DISCORD_TOKEN);

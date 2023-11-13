import { Client, Events, GatewayIntentBits } from "discord.js";
import cron from "cron";
import dotenv from "dotenv";

dotenv.config();

const TOKEN = process.env.DISCORD_TOKEN;

// const CLIENT_ID = "1173646712775127040";

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  // TODO: adjust cron time
  let scheduledMessage = new cron.CronJob("00 31 00 * * *", () => {
    // This runs every day at 10:30:00, you can do anything you want
    // Specifing your guild (server) and your channel
    const guild = client.guilds.cache.get("1117145504925626390");
    const channel = guild.channels.cache.get("1173660009016590437");

    // TODO: handle next dates and handle command to add dates

    // TODO: send count down message
    channel.send("Test message");
  });

  // When you want to start it, use:
  scheduledMessage.start();
});

// Log in to Discord with your client's token
client.login(TOKEN);

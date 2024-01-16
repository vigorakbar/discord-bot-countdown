import { Client, Events, GatewayIntentBits } from "discord.js";
import cron from "cron";
import dotenv from "dotenv";
import moment from "moment-timezone";

dotenv.config();

const TIMEZONE = "Asia/Jakarta";

moment.tz.setDefault(TIMEZONE);

const TOKEN = process.env.DISCORD_TOKEN;

// const CLIENT_ID = "1173646712775127040";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  // TODO: adjust cron time
  let scheduledMessage = new cron.CronJob(
    "00 00 08 * * *",
    () => {
      // sorted please :p
      const defaultMeetups = [
        moment("2023-10-30"), // test before current time
        moment("2023-11-17"),
        moment("2023-12-30"),
        moment("2024-02-24"),
      ];
      const guild = client.guilds.cache.get("1117145504925626390");
      const channel = guild.channels.cache.get("1173660009016590437");

      const upcomingMeetup = defaultMeetups.filter((meetup) =>
        meetup.isAfter(moment().startOf("day"))
      )[0];
      if (!upcomingMeetup) return;

      // TODO: handle next dates and handle command to add dates
      const now = moment().startOf("day");

      const diffMonths = Math.abs(now.diff(upcomingMeetup, "months"));
      const diffDays =
        Math.abs(now.diff(upcomingMeetup, "days")) - diffMonths * 30;
      const monthsMessage = diffMonths ? ` ${diffMonths} months and` : "";
      let message = `Hello 😃
It is${monthsMessage} ${diffDays} days left before the next date!
Can't wait to see you 😊`;
      if (diffMonths || diffDays) {
        channel.send(message);
      }
    },
    undefined,
    undefined,
    TIMEZONE
  );

  scheduledMessage.start();
});

client.login(TOKEN);

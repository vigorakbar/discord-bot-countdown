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
    "00 32 22 * * *",
    () => {
      // sorted please :p
      const defaultMeetups = [
        // name: x days left before {name}!
        { name: "", time: moment("2023-10-30") }, // test before current time
        { name: "", time: moment("2023-11-17") },
        { name: "", time: moment("2023-12-30") },
        { name: "our engagement💍", time: moment("2024-02-24") },
      ];
      const guild = client.guilds.cache.get("1117145504925626390");
      const channel = guild.channels.cache.get("1173660009016590437");

      const upcomingMeetup = defaultMeetups.filter((meetup) =>
        meetup.time.isAfter(moment().startOf("day"))
      )[0];
      if (!upcomingMeetup) return;

      // TODO: handle next dates and handle command to add dates
      const now = moment().startOf("day");

      const diffMonths = Math.abs(now.diff(upcomingMeetup.time, "months"));
      const totalDaysLeft = Math.abs(now.diff(upcomingMeetup.time, "days"));
      const diffDays = totalDaysLeft - diffMonths * 30;
      const monthsMessage = diffMonths
        ? ` ${diffMonths} month${diffMonths > 1 ? "s" : ""} and`
        : "";

      let message = "";

      if (totalDaysLeft === 1) {
        //
        message = `**Hewwo! 💖**

Only **one day** left before **${upcomingMeetup.name || "the next date"}**! 🎉💑
        
See you tomorrow! 😊😊😊`;
        //
        //
      } else if (totalDaysLeft <= 5) {
        //
        message = `**Hewwo! 💖**

It is only **${diffDays} days** left before **${
          upcomingMeetup.name || "the next date"
        }**! ⏳
        
See you soon! 😊😊`;
        //
        //
      } else {
        //
        message = `Hewwo! 💖

It is **${monthsMessage} ${diffDays} day${
          diffDays > 1 ? "s" : ""
        }** left before **${upcomingMeetup.name || "the next date"}**!

Can't wait to see you 😊`;
        //
        //
      }

      if (totalDaysLeft) {
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

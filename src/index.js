require("./config/env");
const client = require("./client");
const commandHandler = require("./handlers/commandHandler");
const eventHandler = require("./handlers/eventHandler");
const { ActivityType } = require("discord.js");

(async () => {
  console.log("TOKEN detected:", !!process.env.TOKEN);

  await eventHandler(client);

  await client.login(process.env.TOKEN);

  client.once("ready", async () => {
    client.user.setActivity("/help", {
      type: ActivityType.Playing,
    });

    await commandHandler(client);
    console.log("MYSQLHOST:", process.env.MYSQLHOST);
console.log("MYSQLUSER:", process.env.MYSQLUSER);
console.log("MYSQLPASSWORD:", process.env.MYSQLPASSWORD);
console.log("MYSQLDATABASE:", process.env.MYSQLDATABASE);
console.log("MYSQLPORT:", process.env.MYSQLPORT);
    console.log(`🤖 Logged in as ${client.user.tag}`);
  });
})();

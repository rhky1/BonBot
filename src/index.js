const client = require("./client");
const commandHandler = require("./handlers/commandHandler");
const eventHandler = require("./handlers/eventHandler");
const { ActivityType } = require("discord.js");

(async () => {
  // load event dulu
  await eventHandler(client);

  // LOGIN DULU
  await client.login(process.env.TOKEN);

  // BARU register command SETELAH READY
  client.once("ready", async () => {
    // set status playing /help
    client.user.setActivity("/help", {
      type: ActivityType.Playing,
    });

    await commandHandler(client);
    console.log(`🤖 Logged in as ${client.user.tag}`);
  });
})();

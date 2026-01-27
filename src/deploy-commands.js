const fs = require("fs");
const path = require("path");
const { REST, Routes } = require("discord.js");
require("dotenv").config();

const commands = [];
const commandsPath = path.join(__dirname, "commands");

// recursive load command
function loadCommands(dir) {
  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);

    if (fs.statSync(fullPath).isDirectory()) {
      loadCommands(fullPath);
      continue;
    }

    if (!file.endsWith(".js")) continue;

    const command = require(fullPath);

    if (!command.data || !command.execute) {
      console.warn(`⚠️ Skip ${file} (invalid structure)`);
      continue;
    }

    commands.push(command.data.toJSON());
  }
}

loadCommands(commandsPath);

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log(`🚀 Deploying ${commands.length} commands...`);

    if (process.env.GUILD_ID) {
      // DEV MODE
      await rest.put(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.GUILD_ID
        ),
        { body: commands }
      );
      console.log("✅ Guild commands deployed (DEV MODE)");
    } else {
      // PROD MODE
      await rest.put(
        Routes.applicationCommands(process.env.CLIENT_ID),
        { body: commands }
      );
      console.log("🌍 Global commands deployed (PROD MODE)");
    }
  } catch (error) {
    console.error("❌ Deploy failed:", error);
  }
})();

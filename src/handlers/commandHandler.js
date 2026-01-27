const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  client.commands = new Map();
  const commands = [];

  const commandsPath = path.join(__dirname, "../commands");

  const loadCommands = (dir) => {
    const files = fs.readdirSync(dir);

    for (const file of files) {
      const fullPath = path.join(dir, file);

      if (fs.statSync(fullPath).isDirectory()) {
        loadCommands(fullPath);
      } else if (file.endsWith(".js")) {
        delete require.cache[require.resolve(fullPath)];
        const command = require(fullPath);

        if (!command.data || !command.execute) continue;

        client.commands.set(command.data.name, command);
        commands.push(command.data.name);
      }
    }
  };

  loadCommands(commandsPath);

  console.log(`✅ Loaded ${commands.length} commands`);
  return commands; // 🔥 INI YANG BIKIN JOIN() AMAN
};

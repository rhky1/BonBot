const fs = require("fs");
const path = require("path");

module.exports = (client) => {
  const eventsPath = path.join(__dirname, "../events");
  const loadedEvents = [];

  const files = fs.readdirSync(eventsPath).filter(f => f.endsWith(".js"));

  for (const file of files) {
    const filePath = path.join(eventsPath, file);
    delete require.cache[require.resolve(filePath)];

    const event = require(filePath);

    if (!event.name || !event.execute) continue;

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }

    loadedEvents.push(event.name);
  }

  console.log(`✅ Loaded ${loadedEvents.length} events`);
  return loadedEvents;
};

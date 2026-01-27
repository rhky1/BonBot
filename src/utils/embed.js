const { EmbedBuilder } = require("discord.js");

module.exports = {
  baseEmbed(title, description) {
    return new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setColor(0x5865F2) // warna Discord
      .setTimestamp();
  }
};

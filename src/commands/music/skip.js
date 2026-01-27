const { SlashCommandBuilder } = require("discord.js");
const music = require("../../services/musicPlayer");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("skip")
    .setDescription("Skip current song"),

  async execute(interaction) {
    music.skip(interaction.guild.id);
    await interaction.reply("⏭️ Skipped");
  }
};

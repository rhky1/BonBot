const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { pauseMusic } = require('../../services/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pause musik saat ini'),

  async execute(interaction) {
    const success = pauseMusic(interaction.guild.id);
    const embed = new EmbedBuilder()
      .setColor(success ? '#FFA500' : 'Red')
      .setDescription(success ? '⏸ Musik dipause.' : '❌ Tidak ada musik yang sedang diputar.');
    await interaction.reply({ embeds: [embed], ephemeral: !success });
  }
};

const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { stopMusic } = require('../../services/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Hentikan musik'),

  async execute(interaction) {
    const success = stopMusic(interaction.guild.id);
    const embed = new EmbedBuilder()
      .setColor(success ? '#FF0000' : 'Red')
      .setDescription(success ? '⏹ Musik dihentikan dan bot keluar dari voice channel.' : '❌ Tidak ada musik yang sedang diputar.');
    await interaction.reply({ embeds: [embed], ephemeral: !success });
  }
};

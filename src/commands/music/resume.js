const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { resumeMusic } = require('../../services/musicPlayer');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Lanjutkan musik yang dipause'),

  async execute(interaction) {
    const success = resumeMusic(interaction.guild.id);
    const embed = new EmbedBuilder()
      .setColor(success ? '#1DB954' : 'Red')
      .setDescription(success ? '▶ Musik dilanjutkan.' : '❌ Tidak ada musik yang sedang dipause.');
    await interaction.reply({ embeds: [embed], ephemeral: !success });
  }
};

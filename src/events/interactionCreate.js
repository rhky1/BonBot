const { Events, EmbedBuilder } = require('discord.js');
const { pauseMusic, resumeMusic, stopMusic, skipMusic, getCurrent } = require('../services/musicPlayer');

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {

    // ======= Tombol interaktif =======
    if (interaction.isButton()) {
      const guildId = interaction.guild.id;
      let embed;

      switch(interaction.customId) {
        case 'pause':
          if (pauseMusic(guildId)) {
            embed = new EmbedBuilder().setColor('#FFA500').setDescription('⏸ Musik dipause.');
          } else {
            embed = new EmbedBuilder().setColor('Red').setDescription('❌ Tidak ada musik yang sedang diputar.');
          }
          await interaction.reply({ embeds: [embed], ephemeral: true });
          break;

        case 'resume':
          if (resumeMusic(guildId)) {
            embed = new EmbedBuilder().setColor('#1DB954').setDescription('▶ Musik dilanjutkan.');
          } else {
            embed = new EmbedBuilder().setColor('Red').setDescription('❌ Tidak ada musik yang sedang dipause.');
          }
          await interaction.reply({ embeds: [embed], ephemeral: true });
          break;

        case 'stop':
          if (stopMusic(guildId)) {
            embed = new EmbedBuilder().setColor('#FF0000').setDescription('⏹ Musik dihentikan dan bot keluar dari voice channel.');
          } else {
            embed = new EmbedBuilder().setColor('Red').setDescription('❌ Tidak ada musik yang sedang diputar.');
          }
          await interaction.reply({ embeds: [embed], ephemeral: true });
          break;

        case 'skip':
          const current = getCurrent(guildId);
          if (!current) {
            embed = new EmbedBuilder().setColor('Red').setDescription('❌ Tidak ada musik yang sedang diputar.');
          } else {
            skipMusic(guildId);
            embed = new EmbedBuilder().setColor('#1DB954').setDescription(`⏭ Lagu **${current.title}** dilewati.`);
          }
          await interaction.reply({ embeds: [embed], ephemeral: true });
          break;

        default:
          await interaction.reply({ content: 'Unknown button.', ephemeral: true });
      }
      return;
    }

    // ======= Slash command handling =======
    if (!interaction.isChatInputCommand()) return;

    const command = interaction.client.commands.get(interaction.commandName);
    if (!command) return;


    try {
      await command.execute(interaction);
    } catch (error) {
      console.error(error);
      await interaction.reply({ content: '❌ Terjadi error saat menjalankan command.', ephemeral: true });
    }
  }
};

const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { playMusic } = require('../../services/musicPlayer');

function formatDuration(seconds) {
  if (!seconds) return "Unknown";
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${sec.toString().padStart(2,'0')}`;
}

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('Putar musik dari YouTube')
    .addStringOption(option => 
      option.setName('query')
        .setDescription('Link atau nama lagu')
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();
    const query = interaction.options.getString('query');

    try {
      const song = await playMusic(interaction, query);
      if (!song) {
        return interaction.editReply('❌ Gagal memutar musik.');
      }

      // ==========================
      // EMBED: NOW PLAYING / QUEUED
      // ==========================
      const embed = new EmbedBuilder()
        .setColor('#1DB954')
        .setThumbnail(song.thumbnail)
        .setFooter({
          text: `Requested by ${interaction.user.tag}`,
          iconURL: interaction.user.displayAvatarURL()
        })
        .setTimestamp();

      // JIKA MASUK QUEUE
      if (song.queued) {
        embed
          .setTitle('📥 Added to Queue')
          .setDescription(`[${song.title}](${song.url})`)
          .addFields(
            { name: '🎵 Channel', value: song.uploader || 'Unknown', inline: true },
            { name: '⏱ Duration', value: formatDuration(song.duration), inline: true },
            { name: '📌 Queue Position', value: `#${song.position}`, inline: false }
          );

        return interaction.editReply({ embeds: [embed] });
      }

      // JIKA LANGSUNG MAIN (NOW PLAYING)
      embed
        .setTitle('🎶 Now Playing')
        .setDescription(`[${song.title}](${song.url})`)
        .addFields(
          { name: '🎵 Channel', value: song.uploader || 'Unknown', inline: true },
          { name: '👁 Views', value: song.view_count ? song.view_count.toLocaleString() : 'Unknown', inline: true },
          { name: '⏱ Duration', value: formatDuration(song.duration), inline: true }
        );

      // Tombol interaktif
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('pause')
          .setLabel('⏸ Pause')
          .setStyle(ButtonStyle.Primary),

        new ButtonBuilder()
          .setCustomId('resume')
          .setLabel('▶ Resume')
          .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
          .setCustomId('skip')
          .setLabel('⏭ Skip')
          .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
          .setCustomId('stop')
          .setLabel('⏹ Stop')
          .setStyle(ButtonStyle.Danger)
      );

      await interaction.editReply({ embeds: [embed], components: [row] });

    } catch (err) {
      const embedErr = new EmbedBuilder()
        .setColor('Red')
        .setDescription(`❌ Terjadi error: ${err.message}`);

      await interaction.editReply({ embeds: [embedErr] });
    }
  }
};

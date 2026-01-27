const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} = require('discord.js');

const isModerator = require("../utility/isModerator");
const db = require('../../config/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarn')
    .setDescription('Delete warn from User')
    .addUserOption(opt =>
      opt.setName('user')
        .setDescription('Select User')
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  async execute(interaction) {
    const user = interaction.options.getUser('user');
    const guildId = interaction.guild.id;
    const moderator = interaction.user;

    await interaction.deferReply();

    // 1️⃣ Ambil jumlah warn sebelum dihapus
    const [rows] = await db.execute(
      'SELECT COUNT(*) AS total FROM warns WHERE guild_id = ? AND user_id = ?',
      [guildId, user.id]
    );

    const totalWarn = rows[0].total;

    if (!isModerator(interaction.user.id)) {
  return interaction.reply({
    content: "❌ You dont have permission to use this command!",
    ephemeral: true
  });
}


    if (totalWarn === 0) {
      return interaction.editReply({
        content: `ℹ️ **${user.tag}** No warn found.`,
        flags: 64
      });
    }

    // 2️⃣ Hapus warn
    await db.execute(
      'DELETE FROM warns WHERE guild_id = ? AND user_id = ?',
      [guildId, user.id]
    );

    // 3️⃣ Embed hasil
    const embed = new EmbedBuilder()
      .setColor(0x2ecc71)
      .setTitle('🧹 Warn Cleared')
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '👤 User', value: `${user.tag}`, inline: true },
        { name: '🛡️ Moderator', value: moderator.tag, inline: true },
        { name: '🗑️ Warn Deleted', value: `${totalWarn}`, inline: false }
      )
      .setFooter({ text: `Server: ${interaction.guild.name}` })
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};

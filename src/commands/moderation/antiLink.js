const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require("discord.js");
const db = require("../../config/database");
const isModerator = require("../utility/isModerator");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("antilink")
    .setDescription("🔒 Aktif / Nonaktif Anti-Link Server")
    .addBooleanOption(opt =>
      opt.setName("status")
        .setDescription("true = aktif | false = nonaktif")
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!isModerator(interaction.user.id)) {
      return interaction.reply({
        content: "❌ Kamu tidak punya izin.",
        ephemeral: true
      });
    }

    const status = interaction.options.getBoolean("status");

    await db.execute(
      "INSERT INTO guilds (guild_id, anti_link) VALUES (?, ?) ON DUPLICATE KEY UPDATE anti_link = ?",
      [interaction.guild.id, status ? 1 : 0, status ? 1 : 0]
    );

    const embed = new EmbedBuilder()
      .setColor(status ? "Green" : "Red")
      .setTitle("🔒 Anti-Link Updated")
      .setDescription(`Status: **${status ? "AKTIF" : "NONAKTIF"}**`)
      .setFooter({ text: `Updated by ${interaction.user.username}` })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};

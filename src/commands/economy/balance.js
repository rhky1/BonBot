const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const pool = require("../../config/database");

// formatter Indonesia (1.000.000)
const formatNumber = new Intl.NumberFormat("id-ID");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your balance"),

  async execute(interaction) {
    const userId = interaction.user.id;
    const user = interaction.user;

    await pool.query(
      "INSERT IGNORE INTO users (user_id, coins) VALUES (?, 0)",
      [userId]
    );

    const [rows] = await pool.query(
      "SELECT coins FROM users WHERE user_id = ?",
      [userId]
    );

    const coins = rows[0]?.coins ?? 0;

    const embed = new EmbedBuilder()
      .setColor(0x00b0ff)
      .setTitle("💰 Balance ")
      .setDescription(`Your Balance : **${user.username}**`)
      .addFields({
        name: "🪙 Coins",
        value: `**${formatNumber.format(coins)}**`,
        inline: true
      })
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: `User ID: ${user.id}` })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};

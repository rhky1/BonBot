const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const pool = require("../../config/database");

const formatNumber = new Intl.NumberFormat("id-ID");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("topcoins")
    .setDescription("Leaderboard top Coins"),

  async execute(interaction) {
    const [rows] = await pool.query(
      "SELECT username, coins FROM users ORDER BY coins DESC LIMIT 10"
    );

    if (!rows.length) {
      return interaction.reply({ content: "❌ No data found!.", ephemeral: true });
    }

    let desc = "";

    rows.forEach((row, i) => {
      const medal =
        i === 0 ? "🥇" :
        i === 1 ? "🥈" :
        i === 2 ? "🥉" : "🏅";

      desc += `${medal} **#${i + 1} ${row.username}**\n💰 ${formatNumber.format(row.coins)} coins\n\n`;
    });

    const embed = new EmbedBuilder()
      .setColor(0xffd700)
      .setTitle("🏆 Top Coins Leaderboard")
      .setDescription(desc)
      .setFooter({ text: interaction.guild.name })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};

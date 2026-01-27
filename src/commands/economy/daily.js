const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const pool = require("../../config/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim daily reward"),

  async execute(interaction) {
    const userId = interaction.user.id;
    const username = interaction.user.username;

    // pastikan user ada
    await pool.query(
      "INSERT INTO users (user_id, username, coins) VALUES (?, ?, 0) ON DUPLICATE KEY UPDATE username = ?",
      [userId, username, username]
    );

    // cek last_daily
    const [rows] = await pool.query(
      "SELECT last_daily FROM users WHERE user_id = ?",
      [userId]
    );

    const lastDaily = rows[0].last_daily;
    const now = new Date();

    if (lastDaily) {
      const diff = now - new Date(lastDaily);
      const hours = diff / (1000 * 60 * 60);

      if (hours < 24) {
        const remaining = Math.ceil(24 - hours);

        const embed = new EmbedBuilder()
          .setColor(0xff5555)
          .setTitle("⏳ Reward Claimed")
          .setDescription("You have claimed **daily reward** today.")
          .addFields({
            name: "🕒 Time Remaining",
            value: `${remaining} Hours left`,
            inline: false
          })
          .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
          .setFooter({ text: "Daily reset every 24H" })
          .setTimestamp();

        return interaction.reply({ embeds: [embed], ephemeral: true });
      }
    }

    // kasih reward & update last_daily
    const reward = 500; // jumlah coins
    await pool.query(
      "UPDATE users SET coins = coins + ?, last_daily = NOW() WHERE user_id = ?",
      [reward, userId]
    );

    const embed = new EmbedBuilder()
      .setColor(0x00ff99)
      .setTitle("🎁 Daily Reward")
      .setDescription(`Congratulations **${username}**!`)
      .addFields(
        { name: "💰 Reward", value: `+${reward} Coins`, inline: true },
        { name: "📅 Status", value: "Claimed", inline: true }
      )
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: "Comeback tomorrow!!" })
      .setTimestamp();

    return interaction.reply({ embeds: [embed] });
  }
};

const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const pool = require("../../config/database");

const format = new Intl.NumberFormat("id-ID");
const cooldown = new Map(); // userId -> timestamp

module.exports = {
  data: new SlashCommandBuilder()
    .setName("gamble")
    .setDescription("Gamble your Coins")
    .addIntegerOption(opt =>
      opt.setName("amount")
        .setDescription("amount")
        .setRequired(true)
        .setMinValue(1)
    ),

  async execute(interaction) {
    const user = interaction.user;
    const userId = user.id;
    const amount = interaction.options.getInteger("amount");

    // cooldown 30 detik
    const now = Date.now();
    if (cooldown.has(userId)) {
      const diff = now - cooldown.get(userId);
      if (diff < 30000) {
        const sisa = Math.ceil((30000 - diff) / 1000);
        return interaction.reply({
          content: `⏳ Wait **${sisa}s** before playing again.`,
          ephemeral: true
        });
      }
    }

    // pastikan user ada
    await pool.query(
      "INSERT INTO users (user_id, username, coins) VALUES (?, ?, 0) ON DUPLICATE KEY UPDATE username = ?",
      [userId, user.username, user.username]
    );

    const [rows] = await pool.query(
      "SELECT coins FROM users WHERE user_id = ?",
      [userId]
    );

    const coins = rows[0]?.coins ?? 0;

    if (amount > coins) {
      return interaction.reply({
        content: "❌ You dont have enough Coins!",
        ephemeral: true
      });
    }

    // 50:50
    const win = Math.random() < 0.5;
    const result = win ? amount : -amount;

    await pool.query(
      "UPDATE users SET coins = coins + ? WHERE user_id = ?",
      [result, userId]
    );

    const [baris] = await pool.query(
      "SELECT coins FROM users WHERE user_id = ?",
      [userId]
    );

    const balance = baris[0]?.coins ?? 0;

    cooldown.set(userId, now);

    const embed = new EmbedBuilder()
      .setTitle("🎰 GAMBLING RESULT")
      .setColor(win ? 0x00ff88 : 0xff4444)
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: "👤 Player", value: user.username, inline: true },
        { name: "🎲 Bet", value: `${format.format(amount)} coins`, inline: true },
        { name: win ? "✅ Win!" : "❌ Lose!", value: win ? `+${format.format(amount)} coins` : `-${format.format(amount)} coins`, inline: false },
        { name: "💳 Balance", value : `${format.format(balance)} Coins`, inline: true} 
      )
      .setFooter({ text: "Gambling" })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};

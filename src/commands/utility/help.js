const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("📖 Displaying Command menu"),

  async execute(interaction) {
    const client = interaction.client;

    const embed = new EmbedBuilder()
      .setColor("#0F172A") // dark premium
      .setAuthor({
        name: `${client.user.username} • Help Menu`,
        iconURL: client.user.displayAvatarURL({ dynamic: true })
      })
      .setDescription(
        "✨ **Welcome to the command center!**\n\n" +
        "Use **slash command (`/`)** to execute command.\n" +
        "Some commands can only be used by **moderators.**\n\n" +
        "━━━━━━━━━━━━━━━━━━━━━━━━━━"
      )

      // 🎵 MUSIC
      .addFields({
        name: "🎵 MUSIC",
        value:
          "🎧 Play music in Voice Channel\n\n" +
          "➤ **Commands**\n" +
          "```" +
          "/play <query> — Play your music\n" +
          "/pause — Pause your music\n" +
          "/resume — Resume your music\n" +
          "/skip — Skip Music\n" +
          "/stop — Stop & bot leave voice" +
          "```",
        inline: false
      })

      // 💰 ECONOMY
      .addFields({
        name: "💰 ECONOMY",
        value:
          "🪙 Sistem coin & gambling\n\n" +
          "➤ **Commands**\n" +
          "```" +
          "/balance — Displaying amount of coin\n" +
          "/daily — Claim daily reward\n" +
          "/topcoins — Leaderboard top coins\n" +
          "/gamble <amount> — Gamble your coins\n" +
          "/dice <amount> — Dice game\n" +
          "```",
        inline: false
      })

      // 🛡️ MODERATION
      .addFields({
        name: "🛡️ MODERATION",
        value:
          "⚠️ Only for moderators\n\n" +
          "➤ **Commands**\n" +
          "```" +
          "/warn <user> — Warn User\n" +
          "/clearwarn <user> — Delete warn\n" +
          "/warnlist — Displaying warn\n" +
          "/givecoin — add coin user\n" +
          "/removecoin — remove coin\n" +
          "/kick — Kick user\n" +
          "/ban — Ban user\n" +
          "```",
        inline: false
      })

      // ⚙️ UTILITY
      .addFields({
        name: "⚙️ UTILITY",
        value:
          "🛠️ Command umum\n\n" +
          "➤ **Commands**\n" +
          "```" +
          "/ping — Check latency bot\n" +
          "/help — Displaying this menu\n" +
          "```",
        inline: false
      })

      .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
      .setFooter({
        text: `Requested by ${interaction.user.username} • ${interaction.guild.name}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};

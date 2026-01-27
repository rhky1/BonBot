const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const db = require("../../config/database");
const isModerator = require("../utility/isModerator");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn User")
    .addUserOption(opt =>
      opt.setName("user")
        .setDescription("Select User")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("reason")
        .setDescription("Reason")
        .setRequired(false)
    ),

  async execute(interaction) {
    // 🚫 CEK WHITELIST
    if (!isModerator(interaction.user.id)) {
      return interaction.reply({
        content: "❌ You dont have permission to use this command!.",
        ephemeral: true
      });
    }

    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No Reason";
    const moderator = interaction.user;
    const guildId = interaction.guild.id;

    await interaction.deferReply();

    await db.execute(
      "INSERT INTO warns (guild_id, user_id, moderator_id, reason) VALUES (?, ?, ?, ?)",
      [guildId, user.id, moderator.id, reason,]
    );

    const [rows] = await db.execute(
      "SELECT COUNT(*) AS total FROM warns WHERE guild_id = ? AND user_id = ?",
      [guildId, user.id]
    );

    const embed = new EmbedBuilder()
      .setColor(0xffa500)
      .setTitle("⚠️ User Warned")
      .addFields(
        { name: "👤 User ID", value:`${user.id}` },
        { name: "🛡️ Moderator", value: moderator.username },
        { name: "📄 Reason", value: reason },
        { name: "📊 Total Warn", value: `${rows[0].total}` }
      )
      .setTimestamp();

    await interaction.editReply({ embeds: [embed] });
  }
};

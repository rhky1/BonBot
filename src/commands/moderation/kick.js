const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const isModerator = require("../utility/isModerator");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick member")
    .addUserOption(opt =>
      opt.setName("user")
        .setDescription("Select user")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("reason")
        .setDescription("Reason")
        .setRequired(false)
    ),

  async execute(interaction) {
    // 🔐 WHITELIST CHECK
    if (!isModerator(interaction.user.id)) {
      return interaction.reply({
        content: "❌ You dont have permission to use this command!.",
        ephemeral: true
      });
    }

    const target = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason") || "No Reason";

    const member = await interaction.guild.members.fetch(target.id);
    await member.kick(reason);

    const embed = new EmbedBuilder()
      .setColor(0xff0000)
      .setTitle("👢 User Kicked")
      .addFields(
        { name: "👤 User", value: target.username },
        { name: "📄 Reason", value: reason }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};

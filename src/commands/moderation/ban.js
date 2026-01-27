const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const isModerator = require("../utility/isModerator");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban member from server")
    .addUserOption(opt =>
      opt.setName("user")
        .setDescription("Select User")
        .setRequired(true)
    )
    .addStringOption(opt =>
      opt.setName("reason")
        .setDescription("Reason")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const reason =
      interaction.options.getString("reason") || "No Reason";

      if (!isModerator(interaction.user.id)) {
  return interaction.reply({
    content: "❌ You dont have permission to use this command!",
    ephemeral: true
  });
}


    if (!member.bannable) {
      return interaction.reply({
        content: "❌ This User cannot be banned",
        ephemeral: true
      });
    }

    await member.ban({ reason });

    await interaction.reply(
      `🔨 **${member.user.tag}** Banned Reason: ${reason}`
    );
  }
};

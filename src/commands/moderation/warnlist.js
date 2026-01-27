const {
  SlashCommandBuilder,
  EmbedBuilder
} = require('discord.js');
const db = require('../../config/database');
const isModerator = require("../utility/isModerator");

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnlist')
    .setDescription('Displaying all users who have warnings.'),

  async execute(interaction) {
    const [rows] = await db.execute(
      `SELECT user_id, COUNT(*) AS total
       FROM warns
       WHERE guild_id = ?
       GROUP BY user_id
       ORDER BY total DESC`,
      [interaction.guild.id]
    );

    if (!isModerator(interaction.user.id)) {
      return interaction.reply({
        content: "❌ you dont have permission to use this command!.",
        ephemeral: true
      });
    }  


    if (rows.length === 0) {
      return interaction.reply({
        content: '✅ No user warned.',
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle('📋 Warned User')
      .setColor('Orange')
      .setTimestamp();

    for (const row of rows) {
      embed.addFields({
        name: `👤 User ID: ${row.user_id}`,
        value:`⚠️ Total Warn: **${row.total}**`,
        inline: false
      });
    }

    await interaction.reply({ embeds: [embed] });
  }
};

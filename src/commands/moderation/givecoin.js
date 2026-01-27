const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const pool = require("../../config/database");
const isModerator = require("../utility/isModerator")
const format = new Intl.NumberFormat("id-ID");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("givecoin")
    .setDescription("give coin to user")
    .addUserOption(opt =>
      opt.setName("user")
        .setDescription("Select User")
        .setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName("amount")
        .setDescription("Amount")
        .setRequired(true)
        .setMinValue(1)
    ),

    async execute(interaction) {
        if (!isModerator(interaction.user.id)) {
          return interaction.reply({
            content: "❌ You dont have permission to use this command!",
            ephemeral: true
          });
        }

        const userId = interaction.user.id;
        const username = interaction.user.username;
        const user = interaction.options.getUser("user");
        const amount = interaction.options.getInteger("amount");


        await interaction.deferReply();

        await pool.query(
      "UPDATE users SET coins = coins + ? WHERE user_id = ?",
      [amount, userId]
    );

    const [baris] = await pool.query(
      "SELECT coins FROM users WHERE user_id = ?",
      [userId]
    );

    const balance = baris[0]?.coins ?? 0;

    const embed = new EmbedBuilder()
      .setColor(0x00ff99)
      .setTitle("Coins Gifter")
      .setDescription(`Congratulations **${username}**! You received coins from moderator`)
      .addFields(
        { name: "🪙 Amount", value: `+${format.format(amount)} Coins`, inline: true },
        { name: "📅 Status", value: "Claimed", inline: true },
        { name: "💳 Balance", value: `${format.format(balance)}` }
      )
      .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true }))
      .setFooter({ text: "Bon-Bot" })
      .setTimestamp();

      await interaction.editReply({ embeds : [embed] })

    }
}
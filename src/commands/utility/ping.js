const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Cek status & latency bot"),

  async execute(interaction) {
    const wsPing = interaction.client.ws.ping;
    const uptime = Math.floor(interaction.client.uptime / 1000);

    const embed = new EmbedBuilder()
      .setColor(0x00ffcc)
      .setTitle("🏓 Pong!")
      .setDescription("Status koneksi bot saat ini")
      .addFields(
        {
          name: "📡 WebSocket Ping",
          value: `\`${wsPing} ms\``,
          inline: true
        },
        {
          name: "⚙️ API Latency",
          value: `\`${Date.now() - interaction.createdTimestamp} ms\``,
          inline: true
        },
        {
          name: "🟢 Status",
          value: "Online",
          inline: true
        },
        {
          name: "⏱️ Uptime",
          value: `<t:${Math.floor(Date.now() / 1000 - uptime)}:R>`,
          inline: false
        }
      )
      .setFooter({
        text: `${interaction.client.user.username}`,
        iconURL: interaction.client.user.displayAvatarURL()
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};

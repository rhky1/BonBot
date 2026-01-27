const db = require("../config/database");
const isModerator = require("../commands/utility/isModerator");

const LINK_REGEX = /(https?:\/\/|www\.)/i;
const INVITE_REGEX = /(discord\.gg\/|discord\.com\/invite\/)/i;

module.exports = {
  name: "messageCreate",
  async execute(message) {
    if (!message.guild) return;
    if (message.author.bot) return;

    // bypass moderator
    if (isModerator(message.author.id)) return;

    const [cfg] = await db.execute(
      "SELECT anti_link FROM guilds WHERE guild_id = ?",
      [message.guild.id]
    );

    if (!cfg[0] || cfg[0].anti_link !== 1) return;

    if (!LINK_REGEX.test(message.content) && !INVITE_REGEX.test(message.content)) return;

    // 🧹 DELETE MESSAGE
    try {
      await message.delete();
    } catch (err) {
      console.error("❌ Gagal delete pesan:", err.message);
      return;
    }

    // ➕ WARN
    await db.execute(
      "INSERT INTO warns (guild_id, user_id, moderator_id, reason) VALUES (?, ?, ?, ?)",
      [
        message.guild.id,
        message.author.id,
        message.client.user.id,
        "Mengirim link / invite"
      ]
    );

    const [rows] = await db.execute(
      "SELECT COUNT(*) AS total FROM warns WHERE guild_id = ? AND user_id = ?",
      [message.guild.id, message.author.id]
    );

    const warnMsg = await message.channel.send(
      `⚠️ ${message.author}, link tidak diperbolehkan!\nTotal warn: **${rows[0].total}**`
    );

    setTimeout(() => warnMsg.delete().catch(() => {}), 5000);
  }
};

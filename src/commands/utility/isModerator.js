require("dotenv").config();

console.log("✅ isModerator loaded");

const moderatorIds = process.env.MODERATOR_IDS
  ? process.env.MODERATOR_IDS.split(",").map(id => id.trim())
  : [];

module.exports = function isModerator(userId) {
  return moderatorIds.includes(userId);
};

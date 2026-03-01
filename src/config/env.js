module.exports = {
  TOKEN: process.env.TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  MODERATOR_IDS: process.env.MODERATOR_IDS?.split(",") || [],
  GUILD_ID: process.env.GUILD_ID,

  DB: {
    HOST: process.env.DB_HOST,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
    NAME: process.env.DB_NAME
  }
};

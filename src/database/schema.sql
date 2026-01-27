CREATE TABLE users (
  user_id BIGINT PRIMARY KEY,
  coins BIGINT 0,
  xp INT DEFAULT 0,
  level INT DEFAULT 1,
  last_daily DATETIME
);

CREATE TABLE guilds (
  guild_id BIGINT PRIMARY KEY,
  log_channel BIGINT
);

CREATE TABLE warns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guild_id BIGINT,
  user_id BIGINT,
  moderator_id BIGINT,
  reason TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

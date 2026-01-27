const { createAudioPlayer, createAudioResource, AudioPlayerStatus, joinVoiceChannel } = require("@discordjs/voice");
const ytdl = require("@distube/ytdl-core");

const queues = new Map();

async function playSong(guildId, song) {
  const queue = queues.get(guildId);
  if (!song) {
    queue.connection.destroy();
    queues.delete(guildId);
    return;
  }

  const stream = ytdl(song.url, {
    filter: "audioonly",
    quality: "highestaudio",
    highWaterMark: 1 << 25
  });

  const resource = createAudioResource(stream);
  queue.player.play(resource);

  queue.textChannel.send(`🎶 **Sekarang diputar:** ${song.title}`);
}

function getQueue(guildId) {
  return queues.get(guildId);
}

async function addSong(interaction, song) {
  const guildId = interaction.guild.id;
  let queue = queues.get(guildId);

  if (!queue) {
    const player = createAudioPlayer();

    const connection = joinVoiceChannel({
      channelId: interaction.member.voice.channel.id,
      guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator
    });

    connection.subscribe(player);

    queue = {
      textChannel: interaction.channel,
      voiceChannel: interaction.member.voice.channel,
      connection,
      player,
      songs: []
    };

    queues.set(guildId, queue);

    player.on(AudioPlayerStatus.Idle, () => {
      queue.songs.shift();
      playSong(guildId, queue.songs[0]);
    });
  }

  queue.songs.push(song);

  if (queue.songs.length === 1) {
    playSong(guildId, song);
  }

  return queue;
}

module.exports = {
  addSong,
  getQueue
};

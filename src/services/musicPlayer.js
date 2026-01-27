const { 
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  AudioPlayerStatus
} = require('@discordjs/voice');
const ytdlp = require('yt-dlp-exec');
const { spawn } = require('child_process');

const guildPlayers = new Map(); 
// guildId -> { player, connection, queue: [], current }

async function playMusic(interaction, query) {
  const guildId = interaction.guild.id;
  const channel = interaction.member.voice.channel;
  if (!channel) return false;

  let guildData = guildPlayers.get(guildId);

  if (!guildData) {
    const connection = joinVoiceChannel({
      channelId: channel.id,
      guildId,
      adapterCreator: interaction.guild.voiceAdapterCreator,
      selfDeaf: false,
      selfMute: false
    });

    const player = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Play }
    });

    connection.subscribe(player);

    guildData = {
      player,
      connection,
      queue: [],
      current: null
    };

    guildPlayers.set(guildId, guildData);

    // AUTO PLAY NEXT
    player.on(AudioPlayerStatus.Idle, async () => {
      if (!guildData) return;

      guildData.queue.shift();

      if (guildData.queue.length > 0) {
        await _playNext(guildId);
      } else {
        try {
          if (
            guildData.connection &&
            guildData.connection.state.status !== 'destroyed'
          ) {
            guildData.connection.destroy();
          }
        } catch {}

        guildData.current = null;
        guildPlayers.delete(guildId);
      }
    });
  }

  // ===== AMBIL INFO LAGU =====
  const info = await ytdlp(query, {
    dumpSingleJson: true,
    noPlaylist: true,
    defaultSearch: 'ytsearch1'
  });

  const data = info.entries ? info.entries[0] : info;

  const format = data.formats
    .filter(f => f.acodec !== 'none' && f.vcodec === 'none')
    .sort((a, b) => b.abr - a.abr)[0];

  if (!format || !format.url) return false;

  const song = {
    title: data.title,
    url: data.webpage_url,
    thumbnail: data.thumbnail,
    duration: data.duration,
    view_count: data.view_count,
    uploader: data.uploader,
    audioUrl: format.url
  };

  // ===== QUEUE =====
  guildData.queue.push(song);
  const position = guildData.queue.length;

  // JIKA BELUM ADA YANG MAIN → LANGSUNG PLAY
  if (!guildData.current) {
    await _playNext(guildId);
    return {
      ...song,
      queued: false,
      position: 1
    };
  }

  // JIKA MASUK QUEUE
  return {
    ...song,
    queued: true,
    position
  };
}

// ===== MAINKAN LAGU BERIKUTNYA =====
async function _playNext(guildId) {
  const guildData = guildPlayers.get(guildId);
  if (!guildData || guildData.queue.length === 0) return;

  const song = guildData.queue[0];

  const ffmpeg = spawn('ffmpeg', [
    '-reconnect','1',
    '-reconnect_streamed','1',
    '-reconnect_delay_max','5',
    '-i', song.audioUrl,
    '-vn',
    '-acodec','libopus',
    '-f','opus',
    'pipe:1'
  ], { stdio: ['ignore', 'pipe', 'ignore'] });

  const resource = createAudioResource(ffmpeg.stdout);
  guildData.player.play(resource);

  guildData.current = song;
  guildData.current.ffmpeg = ffmpeg;
}

// ===== CONTROLS =====
function stopMusic(guildId) {
  const guildData = guildPlayers.get(guildId);
  if (!guildData) return false;

  guildData.player.stop();

  if (guildData.current?.ffmpeg && !guildData.current.ffmpeg.killed) {
    guildData.current.ffmpeg.kill('SIGKILL');
  }

  try {
    if (
      guildData.connection &&
      guildData.connection.state.status !== 'destroyed'
    ) {
      guildData.connection.destroy();
    }
  } catch {}

  guildPlayers.delete(guildId);
  return true;
}

function pauseMusic(guildId) {
  const guildData = guildPlayers.get(guildId);
  if (!guildData) return false;
  guildData.player.pause();
  return true;
}

function resumeMusic(guildId) {
  const guildData = guildPlayers.get(guildId);
  if (!guildData) return false;
  guildData.player.unpause();
  return true;
}

function skipMusic(guildId) {
  const guildData = guildPlayers.get(guildId);
  if (!guildData || guildData.queue.length === 0) return false;
  guildData.player.stop();
  return true;
}

// ===== GETTERS =====
function getCurrent(guildId) {
  const guildData = guildPlayers.get(guildId);
  if (!guildData) return null;
  return guildData.current;
}

function getQueue(guildId) {
  const guildData = guildPlayers.get(guildId);
  if (!guildData) return [];
  return guildData.queue;
}

function getQueueDuration(guildId) {
  const guildData = guildPlayers.get(guildId);
  if (!guildData) return 0;

  return guildData.queue.reduce(
    (total, song) => total + (song.duration || 0),
    0
  );
}

module.exports = {
  playMusic,
  stopMusic,
  pauseMusic,
  resumeMusic,
  skipMusic,
  getCurrent,
  getQueue,
  getQueueDuration
};

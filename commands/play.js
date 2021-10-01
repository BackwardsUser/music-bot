const ytdl = require('ytdl-core')
const dwnld = require('ytdl')
const ytSearch = require('yt-search');
const spotify = require('spotify-url-info');
const voice = require('@discordjs/voice');

const queue = new Map();

module.exports = {
    name: 'p',
    aliases: ['play'],
    description: 'Play a song by name, or link',
    async execute(Discord, client, msg, args) {

        const arg = args.join(' ');
        let song = {};
        let player;
        let connection;
        const vc = msg.member.voice.channel;

        if (args.length === 0) return msg.reply('**You must specify what you would like to play...**');

        if (!connection) {
            connection = voice.joinVoiceChannel({
                channelId: vc.id,
                guildId: msg.guild.id,
                adapterCreator: msg.guild.voiceAdapterCreator,
            });
        };


        if (ytdl.validateURL(args)) {
            const song_info = ytdl.getBasicInfo(args);
            song = { title: (await song_info).videoDetails.title, url: (await song_info).videoDetails.video_url };
        } else {
            const video_finder = async (query) => {
                const videoResult = await ytSearch.search(query);
                return (videoResult.videos.length > 1) ? videoResult.videos[0] : null;
            }
            const video = video_finder(args.join(' '));
            if (video) {
                song = { title: (await video).title, url: (await video).url };
            } else {
                msg.channel.send("**Couldn't find that video...**");
            }
        };

        if (!queue.get(msg.guild.id)) {
            const queue_constructor = {
                voice_channel: vc,
                text_channel: msg.channel,
                connection: null,
                songs: [],
            };
            queue_constructor.songs.push(await song);
            queue.set(msg.guild.id, queue_constructor);

            setTimeout(() => {
                try {
                    player = voice.createAudioPlayer();
                    connection.subscribe(player)
                    const resource = voice.createAudioResource(ytdl(queue.get(msg.guild.id).songs[0].url), {
                        metadata: {
                            title: queue.get(msg.guild.id).songs[0].title,
                        }
                    });
                    player.play(resource);
                    msg.reply('**Now Playing** `' + queue.get(msg.guild.id).songs[0].title + '`');
                    queue.get(msg.guild.id).songs.splice(0, 1)
                } catch (err) {
                    msg.reply('**Something went wrong while trying to join VC (Backwards has been alerted to this issue)**')
                    client.users.fetch('471172695862542337').then(u => {
                        u.send('<@471172695862542337> -> ' + err);
                    });
                    console.error(err);
                    throw err;
                };
            }, 5);
        } else {
            queue.get(msg.guild.id).songs.push(await song);
            msg.reply(`**Added** \`${(await song).title}\` **To the Queue**`)
        };

        setInterval(() => {
            if (!player) return;
            if (!queue) return;
            if (!queue.get(msg.guild.id)) return;
            if (!queue.get(msg.guild.id).songs) return;
            if (player.state.status === "idle") {
                if (queue.get(msg.guild.id).songs.length >= 1) return;
                if (!queue.get(msg.guild.id).songs[0]) return;
                try {
                    player = voice.createAudioPlayer();
                    connection.subscribe(player);
                    const resource = voice.createAudioResource(ytdl(queue.get(msg.guild.id).songs[0].url), {
                        metadata: {
                            title: queue.get(msg.guild.id).songs[0].title,
                        }
                    });
                    player.play(resource);
                    msg.reply('**Now Playing** `' + queue.get(msg.guild.id).songs[0].title + '`');
                    queue.get(msg.guild.id).songs.splice(0, 1);
                } catch (err) {
                    msg.reply('**Something went wrong while trying to join VC (Backwards has been alerted to this issue)**');
                    client.users.fetch('471172695862542337').then(u => {
                        u.send('<@471172695862542337> -> ' + err);
                    });
                    console.error(err);
                    throw err;
                };
            };
        }, 5);

        module.exports.queue = queue;

        module.exports.stopPlayer = {
            execute() {
                player.stop();
            }
        };

        module.exports.leavevc = {
            execute() {
                if (!connection) return msg.channel.send('**The Bot isn\'t in a VC**');
                if (player) {
                    player.stop();
                }
                if (queue.get(msg.guild.id)) {
                    queue.delete(msg.guild.id);
                }
                connection.disconnect();
            }
        };

        module.exports.playSong = {
            execute() {
                try {
                    player = voice.createAudioPlayer();
                    connection.subscribe(player);
                    const resource = voice.createAudioResource(ytdl(queue.get(msg.guild.id).songs[0].url), {
                        metadata: {
                            title: queue.get(msg.guild.id).songs[0].title,
                        }
                    });
                    player.play(resource);
                    msg.reply('**Now Playing** `' + queue.get(msg.guild.id).songs[0].title + '`');
                    queue.get(msg.guild.id).songs.splice(0, 1);
                } catch (err) {
                    msg.reply('**Something went wrong while trying to join VC (Backwards has been alerted to this issue)**');
                    client.users.fetch('471172695862542337').then(u => {
                        u.send('<@471172695862542337> -> ' + err);
                    });
                    console.error(err);
                    throw err;
                };
            }
        };
    }
};
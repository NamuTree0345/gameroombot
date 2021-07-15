const discord = require('discord.js')
const ytdl = require('ytdl-core')
const yts = require('yt-search')
const fs = require('fs')
const client = new discord.Client()
const config = require('./config.json')
const queue = new Map()

const jommandReq = require('jommand')
const { play, skip, stop } = require('./util/music')
const jommand = new jommandReq.Jommand('!')

console.log('[ Initiallizer ] Register commands...')
fs.readdirSync('./commands').forEach((file) => {
    if(file.endsWith('.js')) {
        jommand.createCommand(require('./commands/' + file.replace('.js', '')).command)
        console.log('[ Command ] Registered ' + file.replace('.js', '') + '!')
    }
})

client.on('ready', () => {
    console.log('[ Bot ] Ready!')
})

function playMusic(guild, song) {
    const serverQueue = queue.get(guild.id);
    if (!song) {
      serverQueue.voiceChannel.leave();
      queue.delete(guild.id);
      return;
    }

    const dispatcher = serverQueue.connection
        .play(ytdl(song.url))
        .on("finish", () => {
            serverQueue.songs.shift();
            playMusic(guild, serverQueue.songs[0]);
        })
        .on("error", error => console.error(error));
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);

    let embed = new discord.MessageEmbed()
    embed.setTitle('현재 플레이 중')
    embed.setThumbnail(song.thumb)
    embed.addField('음악 이름', `\`${song.title}\``)
    serverQueue.textChannel.send(embed);
}

client.on('message', async (msg) => {

    if (msg.author.bot) return;

    jommand.executeCommand(msg)

    if (msg.content.startsWith(`!재생`)) {
        const args = msg.content.split(" ");

        const voiceChannel = msg.member.voice.channel;
        if (!voiceChannel)
          return msg.channel.send(
            ":x: 먼저 음성 통화방에 들어가주세요."
          );
        const permissions = voiceChannel.permissionsFor(msg.client.user);
        if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
          return msg.channel.send(
            ":x: 음성 채널에 들어가고 말할 권한이 필요합니다."
          );
        }
    
        let songInfo
        let song
        if(args[1].startsWith('http')) {
            songInfo = await ytdl.getInfo(args[1]);
            song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
                thumb: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url
            };
        } else {
            const newArg = args.slice(1, args.length)
            let string = ''
            newArg.forEach((elem) =>{
                string += elem + ' '
            })
            const result = await yts(string)
            songInfo = await ytdl.getInfo(result.videos[0].url);
            song = {
                title: songInfo.videoDetails.title,
                url: songInfo.videoDetails.video_url,
                thumb: songInfo.player_response.videoDetails.thumbnail.thumbnails[0].url
            };
        }
    
        const serverQueue = queue.get(msg.guild.id);

        if(!serverQueue) {
            // Creating the contract for our queue
            const queueContruct = {
                textChannel: msg.channel,
                voiceChannel: voiceChannel,
                connection: null,
                songs: [],
                volume: 100,
                playing: true,
            };
            // Setting the queue using our contract
            queue.set(msg.guild.id, queueContruct);
            // Pushing the song to our songs array
            queueContruct.songs.push(song);
            
            try {
                // Here we try to join the voicechat and save our connection into our object.
                var connection = await voiceChannel.join();
                queueContruct.connection = connection;
                // Calling the play function to start a song
                playMusic(msg.guild, queueContruct.songs[0]);
            } catch (err) {
                // Printing the error message if the bot fails to join the voicechat
                console.log(err);
                queue.delete(msg.guild.id);
                return msg.channel.send(err);
            }
        } else {
            serverQueue.songs.push(song);
            console.log(serverQueue.songs);
            return msg.channel.send(`\`${song.title}\`이 대기열에 추가되었습니다!`);
        }

        return;
    } else if (msg.content.startsWith(`!건너뛰기`)) {
        const serverQueue = queue.get(msg.guild.id);
        skip(msg, serverQueue);
        return;
    } else if (msg.content.startsWith(`!정지`)) {
        const serverQueue = queue.get(msg.guild.id);
        stop(msg, serverQueue);
        return;
    } else if (msg.content.startsWith(`!대기열`)) {
        const serverQueue = queue.get(msg.guild.id);
        const nexts = serverQueue.songs.slice(1, serverQueue.songs.length)
        let text = '```'
        nexts.forEach((elem) => {
            text += '1. ' + elem.title + '\n'
        })
        text += '```'
        let embed = new discord.MessageEmbed()
            .setTitle('대기열')
            .addField('현재 음악', '`' + serverQueue.songs[0].title + '`')
            .setThumbnail(serverQueue.songs[0].thumb)
            .addField('다음 음악', text)
        msg.channel.send(embed)
    } else if (msg.content.startsWith(`!볼륨`)) {
        const serverQueue = queue.get(msg.guild.id);
        const before = serverQueue.volume
        serverQueue.volume = parseInt(msg.content.split(' ')[1])
        //serverQueue.connection.player.setVolumeLogarithmic(serverQueue.volume / 100);
        const dispatcher = serverQueue.connection.dispatcher
        dispatcher.setVolumeLogarithmic(serverQueue.volume / 100)
        queue.set(msg.guild.id, serverQueue)
        return msg.channel.send('볼륨이 `' + before + '%`에서 `' + serverQueue.volume + '%`으로 변경되었습니다.')
    }

})

if(config.debugging) console.log('[ Info ] Debug version')
client.login(config.debugging ? config.devToken : config.token)
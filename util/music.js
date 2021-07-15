const {Message} = require('discord.js')
const ytdl = require('ytdl-core')

/**
 * 
 * @param {Message} msg 
 * @param {*} serverQueue 
 */
module.exports.play = async (msg, serverQueue) => {

}

/**
 * 
 * @param {Message} msg 
 * @param {*} serverQueue 
 */
module.exports.stop = (msg, serverQueue) => {
    if (!msg.member.voice.channel)
        return msg.channel.send(
        "You have to be in a voice channel to stop the music!"
        );
  
    if (!serverQueue)
        return msg.channel.send("There is no song that I could stop!");
        
    serverQueue.songs = [];
    serverQueue.connection.dispatcher.end();
}

/**
 * 
 * @param {Message} msg 
 * @param {*} serverQueue 
 */
module.exports.skip = (msg, serverQueue) => {
    if (!msg.member.voice.channel)
    return msg.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
    if (!serverQueue)
        return msg.channel.send("There is no song that I could skip!");
    serverQueue.connection.dispatcher.end();
}
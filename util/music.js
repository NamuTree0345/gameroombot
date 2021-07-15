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
        "음성 통화방에 들어가야 멈출 수 있습니다!"
        );
  
    if (!serverQueue)
        return msg.channel.send("멈출 음악이 없습니다!");
        
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
      "음성 통화방에 들어가야 건너뛸 수 있습니다!"
    );
    if (!serverQueue)
        return msg.channel.send("건너뛸 음악이 없습니다!");
    serverQueue.connection.dispatcher.end();
}
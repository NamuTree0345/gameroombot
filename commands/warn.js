const { Command, CommandArgument } = require("jommand");
const discord = require('discord.js')
const fs = require('fs').promises
const {initConfig} = require('../util/config')

module.exports.WarnActionArgument = class WarnActionArgument extends CommandArgument {

    checkValid(rawData) {
        return (rawData === '추가' || rawData === '제거')
    }

    parseData(rawData) {
        return rawData
    }

}

module.exports.command = new Command('경고', async (msg, ctx) => {

    if(!msg.member.hasPermission('ADMINISTRATOR')) {
        msg.channel.send(':x: 관리자 권한이 필요합니다.')
        return
    }
    switch(ctx.parseArgument('동작<추가, 제거>')) {
        case '추가':
            if(msg.mentions.members.size === 1) {
                let warns = 1
                let newData = {}
                if(require('fs').existsSync('./data/user-' + msg.mentions.members.first().id + '.json')) {
                    await fs.readFile('./data/user-' + msg.mentions.members.first().id + '.json', 'utf-8').then((value) => {
                        newData = JSON.parse(value)
                        warns += JSON.parse(value).warns
                        newData.warns = warns
                    })
                } else {
                    newData = await initConfig(msg.mentions.members.first().id)
                    newData.warns = warns
                }
                await fs.writeFile('./data/user-' + msg.mentions.members.first().id + '.json', JSON.stringify(newData))
                
                const embed = new discord.MessageEmbed()
                    .setTitle('경고')
                    .setColor(0xFF0000)
                    .setDescription('<@' + msg.mentions.members.first().id + '>님이 경고를 받았습니다.')
                    .addField('현재 경고 수', warns)
                msg.channel.send(embed)
            } else {
                msg.channel.send(':x: 언급을 추가해주세요.')
            }
            break
        case '제거':
            if(msg.mentions.members.size === 1) {
                let newData = {}
                if(require('fs').existsSync('./data/user-' + msg.mentions.members.first().id + '.json')) {
                    await fs.readFile('./data/user-' + msg.mentions.members.first().id + '.json', 'utf-8').then((value) => {
                        newData = JSON.parse(value)
                        newData.warns -= 1
                    })
                } else {
                    newData = await initConfig(msg.mentions.members.first().id)
                    newData.warns -= 1
                }
                await fs.writeFile('./data/user-' + msg.mentions.members.first().id + '.json', JSON.stringify(newData))
                
                const embed = new discord.MessageEmbed()
                    .setTitle('경고 제거')
                    .setColor(0x00FF00)
                    .setDescription('<@' + msg.mentions.members.first().id + '>님이 경고를 제거받으셨습니다.')
                    .addField('현재 경고 수', newData.warns)
                msg.channel.send(embed)
            } else {
                msg.channel.send(':x: 언급을 추가해주세요.')
            }
            break
}

}, [new this.WarnActionArgument('동작<추가, 제거>')])
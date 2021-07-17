const { Command, IntArgument } = require("jommand");
const fs = require('fs').promises

module.exports.command = new Command('dataformat', async (msg, ctx) => {

    if(!msg.member.hasPermission('ADMINISTRATOR')) {
        msg.channel.send(':x: 관리자 권한이 필요합니다.')
        return
    }

    await msg.channel.send('Finding data format...')
    const read = await fs.readdir('./data/')
    for(let i = 0; i < read.length; i++) {
        const elem = read[i]
        const value = await fs.readFile('./data/' + elem, 'utf-8')
        const data = JSON.parse(value)
        if(data.point === undefined) {
            data.point = 0
            await msg.channel.send('Applied point to user data ' + data.id + '!')
        }
    }

}, [])
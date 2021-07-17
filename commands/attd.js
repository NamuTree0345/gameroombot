const { Command, IntArgument } = require("jommand")
const {initConfig} = require('../util/config')
const fs = require('fs/promises')

module.exports.command = new Command('출첵', async (msg, ctx) => {
    let newData = {}
    if(require('fs').existsSync('./data/user-' + msg.author.id + '.json')) {
        await fs.readFile('./data/user-' + msg.author.id + '.json', 'utf-8').then((value) => {
            newData = JSON.parse(value)
        })
    } else {
        newData = await initConfig(msg.author.id)
    }
    if(newData.lastAttd === '') {
        let now = new Date()
        newData.lastAttd = now
        if(newData.point === undefined) {
            newData.point = 5
        } else {
            newData.point = newData.point + 5
        }
        msg.channel.send(`:star2: ${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 출첵을 완료하였습니다!`)
    } else {
        let date = new Date(newData.lastAttd)
        let now = new Date()
        if(date.getFullYear() == now.getFullYear() && date.getMonth() == now.getMonth() && date.getDate() == now.getDate()) {
            msg.channel.send(`:x: 이미 출첵을 완료했습니다!`)
        } else {
            newData.lastAttd = now
            newData.point = newData.point + 5
            msg.channel.send(`:star2: ${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 출첵을 완료하였습니다!`)
        }
    }
    await fs.writeFile('./data/user-' + msg.author.id + '.json', JSON.stringify(newData))
}, [])
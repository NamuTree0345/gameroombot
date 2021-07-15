const { Command } = require("jommand");
const {initConfig} = require('../util/config')
const fs = require('fs/promises')

module.exports.command = new Command('리더보드', async (msg, ctx) => {

    const waitMsg = await msg.channel.send('<a:loading:865033893954846721> 로딩중입니다..')

    let dir = await fs.readdir('./data')
    let dates = []
    //dir.forEach(async (elem) => {
    for(let i = 0; i < dir.length; i++) {
        const elem = dir[i]
        let res = await fs.readFile('./data/' + elem, 'utf8')
        let a = JSON.parse(res)
        if(a.lastAttd !== '') {
            dates[dates.length] = {
                id: a.id,
                date: new Date(a.lastAttd)
            }
        }
    }
    let sortedDate = dates.sort(function(a,b){
        // Turn your strings into dates, and then subtract them
        // to get a value that is either negative, positive, or zero.
        return new Date(a.date) - new Date(b.date);
    });

    let text = '출석체크 리더보드\n```'
    let number = 1
    for(let i = 0; i < sortedDate.length; i++) {
        const res = await msg.client.users.fetch(sortedDate[i].id)
        text += number + '위: ' + res.username + ' - ' + `${sortedDate[i].date.getMonth() + 1}월 ${sortedDate[i].date.getDate()}일 ${sortedDate[i].date.getHours()}시 ${sortedDate[i].date.getMinutes()}분 ${sortedDate[i].date.getSeconds()}초` + '\n'
        number++
    }
    text += '```'
    waitMsg.delete()
    msg.channel.send(text)
}, [])
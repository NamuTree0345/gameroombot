const { Command } = require("jommand");
const exec = require('child_process').exec

module.exports.command = new Command('deploy', async (msg, ctx) => {

    if(!msg.member.hasPermission('ADMINISTRATOR')) {
        msg.channel.send(':x: 관리자 권한이 필요합니다.')
        return
    }

    await msg.channel.send('<a:loading:865033893954846721> Pulling from git...')
    let txt = 'Pulled Successfully!\n```diff'
    exec('git pull', (err, stdout, stderr) => {
        txt += stdout
    })
    txt += '```'
    await msg.channel.send(txt)
    await msg.channel.send('Restarting...')
    exec('pm2 restart gameroom')

})
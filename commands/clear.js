const { Command, IntArgument } = require("jommand");

module.exports.command = new Command('제거', async (msg, ctx) => {

    if(!msg.member.hasPermission('ADMINISTRATOR')) {
        msg.channel.send(':x: 관리자 권한이 필요합니다.')
        return
    }

    await msg.channel.bulkDelete(ctx.parseArgument('제거할 수') + 1)
    await msg.channel.send(':white_check_mark: 제거 완료!')

}, [new IntArgument('제거할 수')])
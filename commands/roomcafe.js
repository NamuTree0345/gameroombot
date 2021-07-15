const { Command, CommandArgument } = require("jommand");

let cafeMap = new Map()

module.exports.RoomcafeActionArgument = class RoomcafeActionArgument extends CommandArgument {

    checkValid(rawData) {
        return (rawData === '생성' || rawData === '삭제')
    }

    parseData(rawData) {
        return rawData
    }

}

module.exports.command = new Command('룸카페', (msg, ctx) => {

    msg.delete()
    switch(ctx.parseArgument('동작<생성, 유저추가, 삭제>')) {
        case '생성':
            if(msg.mentions.users.size >= 1) {

                let permissionOverwrite = [ {id: msg.guild.roles.cache.find(r => r.name === '@everyone'), deny: ['VIEW_CHANNEL']} ]

                permissionOverwrite.push({id: msg.member, allow: ['VIEW_CHANNEL']})
                msg.mentions.members.forEach((user) => {
                    permissionOverwrite.push({id: user, allow: ['VIEW_CHANNEL']})
                })

                msg.guild.channels
                .create('roomcafe-' + msg.author.username, {type: 'voice', permissionOverwrites: permissionOverwrite})
                .then((channel) => {
                    cafeMap.set(msg.author.id, channel)
                    msg.author.send(':white_check_mark: 룸카페 생성 완료!')
                })
            } else {
                msg.author.send(':x: 명령어가 잘못되었습니다. 멘션 추가 부탁!!')
            }
            break
        case '유저추가':
            if(cafeMap.has(msg.author.id)) {
                cafeMap.get(msg.author.id).updateOverwrite(msg.mentions.members.first(), { VIEW_CHANNEL: true })
                msg.author.send(':white_check_mark: 권한 추가 완료!')
            }
            break
        case '삭제':
            if(cafeMap.has(msg.author.id)) {
                cafeMap.get(msg.author.id).delete()
                msg.author.send(':white_check_mark: 룸카페 삭제 완료!')
            }
            break
    }

}, [new this.RoomcafeActionArgument('동작<생성, 유저추가, 삭제>')])
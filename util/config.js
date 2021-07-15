const fs = require('fs').promises
/**
 * 
 * @param {String} id 
 */
module.exports.initConfig = async (id) => {
    await fs.writeFile('../data/user-' + msg.mentions.users.first().id + '.json', JSON.stringify({
        id: msg.mentions.users.first().id,
        pets: [],
        warns: 0
    }))
    return {
        id: msg.mentions.users.first().id,
        pets: [],
        warns: 0
    }
}
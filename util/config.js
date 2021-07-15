const fs = require('fs').promises
/**
 * 
 * @param {String} id 
 */
module.exports.initConfig = async (id) => {
    await fs.writeFile('./data/user-' + id + '.json', JSON.stringify({
        id: id,
        pets: [],
        warns: 0,
        lastAttd: ''
    }))
    return {
        id: id,
        pets: [],
        warns: 0,
        lastAttd: ''
    }
}
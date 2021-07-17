const fs = require('fs').promises
/**
 * 
 * @param {String} id 
 */
module.exports.initConfig = async (id) => {
    await fs.writeFile('./data/user-' + id + '.json', JSON.stringify({
        id: id,
        point: 0,
        pets: [],
        warns: 0,
        lastAttd: ''
    }))
    return {
        id: id,
        point: 0,
        pets: [],
        warns: 0,
        lastAttd: ''
    }
}
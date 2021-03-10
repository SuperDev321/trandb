const { Blocks } = require('../../database/models');
const ipInt = require('ip-to-int');
const addBlock = async (room, username, ip, role) => {
    try {
        console.log('add block', room)
        let ipNum = ipInt(ip).toInt();
        let type =( role === 'admin' || role === 'super_admn') ? 'all': 'room'
        let ban = await Blocks.findOne({room, username, ip: ipNum, type});
        if(!ban) {
            await Blocks.create({room, username, ip: ipNum, type});
        }
        return true;
    } catch(err) {
        console.log(err)
        return false;
    }
};

module.exports = addBlock;
const { Blocks } = require('../../database/models');
const ipInt = require('ip-to-int');
const addBlock = async (room, username, ip) => {
    try {
        let ipNum = ipInt(ip).toInt();
        let ban = await Blocks.findOne({room, username, ip: ipNum, type: 'room'});
        if(!ban) {
            await Blocks.create({room, username, ip: ipNum, type: 'room'});
        }
        return true;
    } catch(err) {
        return false;
    }
};

module.exports = addBlock;
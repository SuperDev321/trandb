const { Blocks } = require('../../database/models');
const ipInt = require('ip-to-int');
const removeBlock = async (room, username, ip) => {
    try {
        let ipNum = ipInt(ip).toInt();
         await Blocks.remove({
            $or: [
                {room, username},
                {room, ip: ipNum},
            ]
        });
        return true;
    } catch(err) {
        return false;
    }
};

module.exports = removeBlock;
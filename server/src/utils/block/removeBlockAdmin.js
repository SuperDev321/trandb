const { Blocks } = require('../../database/models');
const ipInt = require('ip-to-int');
const removeBlockAdmin = async (username, ip) => {
    try {
        let ipNum = ipInt(ip).toInt();
         await Blocks.remove({
            $or: [
                {username},
                {ip: ipNum},
            ]
        });
        return true;
    } catch(err) {
        return false;
    }
};

module.exports = removeBlockAdmin;
const { CameraBans } = require('../../database/models');
const ipInt = require('ip-to-int');
const cameraBanByUser = async (room, username, ip) => {
    let ipNum = ipInt(ip).toInt();
    let ban = await CameraBans.findOne({ room, username, ip: ipNum, type: 'ip' });
    if(!ban) {
        await CameraBans.create({ room, username, ip: ipNum, type: 'ip' });
    }
    return true;
};

module.exports = cameraBanByUser;

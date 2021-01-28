const { Bans } = require('../../database/models');
const ipInt = require('ip-to-int');
const banByUser = async (room, username, ip) => {
    let ipNum = ipInt(ip).toInt();
    let ban = await Bans.findOne({room, username, ip: ipNum, type: 'ip'});
    if(!ban) {
        await Bans.create({room, username, ip: ipNum, type: 'ip'});
    }
    return true;
};

module.exports = banByUser;

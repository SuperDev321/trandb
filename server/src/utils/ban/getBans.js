const { Bans } = require('../../database/models');
const ipInt = require('ip-to-int');
const getAllBans = async () => {
    let bans = await Bans.find({});
    bans = bans.map(({_id, username, room, ip, fromIp, toIp, type, created_at}) => {
        let realIp = null, realStartIp = null, realEndIp = null;
        if(ip)
            realIp = ipInt(ip).toIP();
        if(fromIp) {
            realStartIp = ipInt(fromIp).toIP();
        }
        if(toIp) {
            realEndIp = ipInt(toIp).toIP();
        }
        return {_id, username, room: room? room: 'all', ip: realIp, fromIp: realStartIp, toIp: realEndIp, type, created_at};
    })
    return bans;
};

module.exports = getAllBans;
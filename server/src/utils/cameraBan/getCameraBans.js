const { CameraBans } = require('../../database/models');
const ipInt = require('ip-to-int');

const getAllCameraBans = async () => {
    let bans = await CameraBans.find({});
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

const getRoomCameraBans = async (room) => {
    if (room && room !== '') {
        let bans = await CameraBans.find({ room });
        bans = bans.map(({ ip, fromIp, toIp, username }) => {
            let realIp = ip? ipInt(ip).toIP(): null;
            const realFromIp = fromIp? ipInt(fromIp).toIP(): null;
            const realToIp = toIp? ipInt(toIp).toIP(): null;

            return { ip: realIp, username, toIp: realToIp, fromIp: realFromIp };
        });
        return bans;
    } else {
        return [];
    }
}

const getGlobalCameraBans = async () => {
    let bans = await CameraBans.find({ room: undefined });
    bans = bans.map(({ ip, fromIp, toIp, username }) => {
        let realIp = ip? ipInt(ip).toIP(): null;
        const realFromIp = fromIp? ipInt(fromIp).toIP(): null;
        const realToIp = toIp? ipInt(toIp).toIP(): null;

        return { ip: realIp, username, toIp: realToIp, fromIp: realFromIp };
    });
    return bans;
}

module.exports = {
    getAllCameraBans,
    getRoomCameraBans,
    getGlobalCameraBans
};
const { CameraBans } = require('../../database/models');
const ipInt = require('ip-to-int');
const isIp = require('is-ip');

const checkCameraBan = async (room, username, ip) => {
    let ipNum = null;
    if (isIp.v4(ip)) {
        ipNum = ipInt(ip).toInt();
    } else if(ip) {
        ipNum = (parseInt(ip).toString());
    }
    if (username) {
        let nameBan = await CameraBans.findOne({
            $or: [
                { room, username },
                { room: undefined, username },
            ]
        });
        if (nameBan) {
            return { isBan: true, banType: nameBan.room? true : false };
        }
    }
    if (ipNum) {
        let ipBan =  await CameraBans.findOne({
            $or: [
                {room, ip: ipNum, type: 'ip'},
                {$and: [
                    {room},
                    {type: 'range'},
                    {
                        $and: 
                        [
                            { fromIp: { $lt: ipNum} },
                            { toIp: {$gt: ipNum} }
                        ]
                    }
                    ]
                },
                {room: undefined, ip: ipNum, type: 'ip'},
                {$and: [
                    {room: undefined},
                    {type: 'range'},
                    {
                        $and: 
                        [
                            { fromIp: { $lt: ipNum} },
                            { toIp: {$gt: ipNum} }
                        ]
                    }
                    ]
                }
            ]
        });
        if (ipBan) {
            return { isBan: true, banType: ipBan.room? true : false };
        }
    }
    return { isBan: false };
};

module.exports = checkCameraBan;

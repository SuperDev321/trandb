const { CameraBans } = require('../../database/models');
const ipInt = require('ip-to-int');

const cameraBanByNameAndIp = async (room=null, username, ip=null, fromIp=null, toIp=null) => {
    let ban = null;
    try{
        if(room) { // room ban
            if (ip) {
                let ipNum = ipInt(ip).toInt();
                ban = await CameraBans.findOne({room, username, ip: ipNum, type: 'ip'});
                if(!ban)
                    ban = await CameraBans.create({room, username, ip: ipNum, type: 'ip'});
            } else if(fromIp && toIp) {
                let ipFromNum = ipInt(fromIp).toInt();
                let ipToNum = ipInt(toIp).toInt();
                ban = await CameraBans.findOne({room, username, fromIp: ipFromNum, toIp: ipToNum, type: 'range'});
                if(!ban)
                    ban = await CameraBans.create({room, username, fromIp: ipFromNum, toIp: ipToNum, type: 'range'});
            } else {
                return false;
            }
        } else { // global ban
            if (ip) {
                let ipNum = ipInt(ip).toInt();
                ban = await CameraBans.findOne({ username, ip: ipNum, room: undefined, type: 'ip'});
                
                if(!ban)
                    ban = await CameraBans.create({ username, ip: ipNum, type: 'ip'});
            } else if (fromIp && toIp) {
                let ipFromNum = ipInt(fromIp).toInt();
                let ipToNum = ipInt(toIp).toInt();
                ban = await CameraBans.findOne({ username, fromIp: ipFromNum, toIp: ipToNum, room: undefined, type: 'range'});
                if(!ban)
                    ban = await CameraBans.create({ username, fromIp: ipFromNum, toIp: ipToNum, type: 'range'});
            } else {
                return false;
            }
        }
        return true;
    } catch (err) {
        console.log(err)
        return false;
    }
};

module.exports = cameraBanByNameAndIp;

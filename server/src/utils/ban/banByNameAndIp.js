const { Bans } = require('../../database/models');
const ipInt = require('ip-to-int');

const banByNameAndIp = async (room, username, ip, fromIp, toIp) => {
    let ban = null;
    console.log('ban infos', username, fromIp, toIp, ip);
    try{
        if(room) { // room ban
            if(ip) {
                let ipNum = ipInt(ip).toInt();
                ban = await Bans.findOne({room, username, ip: ipNum, type: 'ip'});
                if(!ban)
                    ban = await Bans.create({room, username, ip: ipNum, type: 'ip'});
            } else if(fromIp && toIp) {
                let ipFromNum = ipInt(fromIp).toInt();
                let ipToNum = ipInt(toIp).toInt();
                ban = await Bans.findOne({room, username, fromIp: ipFromNum, toIp: ipToNum, type: 'range'});
                if(!ban)
                    ban = await Bans.create({room, username, fromIp: ipFromNum, toIp: ipToNum, type: 'range'});
            }
        } else { // global ban
            if(ip) {
                let ipNum = ipInt(ip).toInt();
                ban = await Bans.findOne({ username, ip: ipNum, room: undefined, type: 'ip'});
                console.log('global ban find', ban)
                if(!ban)
                    ban = await Bans.create({ username, ip: ipNum, type: 'ip'});
            } else if(fromIp && toIp) {
                let ipFromNum = ipInt(fromIp).toInt();
                let ipToNum = ipInt(toIp).toInt();
                ban = await Bans.findOne({ username, fromIp: ipFromNum, toIp: ipToNum, room: undefined, type: 'range'});
                if(!ban)
                    ban = await Bans.create({ username, fromIp: ipFromNum, toIp: ipToNum, type: 'range'});
            }
        }
        return true;
    } catch (err) {
        console.log(err)
        return false;
    }
    

    return true;
    
    // if (UserRole !== 'admin') {
    //     throw createError(
    //     403,
    //     'Forbidden',
    //     'You are not allowed to ban this user.'
    //     );
    // }

  // return Rooms.create(room);
};

module.exports = banByNameAndIp;

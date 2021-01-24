const { Bans } = require('../../database/models');
const ipInt = require('ip-to-int');
const banByName = async (room, username) => {
    
    let ban = await Bans.findOne({room, username});
    console.log(ban)
    if(!ban) {
        await Bans.create({room, username});
    }
    return true;
};

module.exports = banByName;

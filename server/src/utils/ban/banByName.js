const { Bans } = require('../../database/models');
const createError = require('../createError');

const banByName = async (room, username) => {

    let ban = await Bans.findOne({room, username});
    console.log(ban)
    if(!ban) {
        await Bans.create({room, username});
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

module.exports = banByName;

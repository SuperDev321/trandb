const { createError } = require('..');
const { Bans } = require('../../database/models');
const findUserById = require('../user/findUserById');

const checkBan = async (room, username, ip) => {
    let nameBan = await Bans.findOne({
        $or: [
            {room, username},
            {room: '', username}
        ]
    });
    if(nameBan) {
        return true;
    }
};

module.exports = checkBan;

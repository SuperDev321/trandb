const { Rooms, Users } = require('../../database/models');
const ipInt = require('ip-to-int');
const getIp = async (username) => {
    let ip = null;
    const user = await Users.findOne({username});
    if(user && user.ip) {
        return ipInt(user.ip).toIP();
    } else {
        return null;
    }
};

module.exports = getIp;

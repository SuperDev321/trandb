const { Users } = require('../../database/models');
const ipInt = require('ip-to-int');
const createError = require('../createError');
const updateIp = async (userId, ip) => {
    try {
        console.log(userId, ip)
        let ipNum = ipInt(ip).toInt();
        await Users.updateOne({ _id: userId}, {ip: ipNum });
    } catch(err) {
        console.log(err)
        throw createError(400, 'Bad Request', err);
    }
};

module.exports = updateIp;

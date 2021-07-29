const { CameraBans } = require('../../database/models');
const ipInt = require('ip-to-int');
const removeCameraBan = async (room, username, ip, isAdmin = false) => {
    console.log(ip, 'remove camera ban')
    try {
        let ipNum = ipInt(ip).toInt();
        if (isAdmin) {
            await CameraBans.remove({
                $or: [
                    {username},
                    {ip: ipNum},
                ]
            });
        } else {
            await CameraBans.remove({
                $or: [
                    {room, username},
                    {room, ip: ipNum},
                ]
            });
        }
        return true;
    } catch(err) {
        console.log(err)
        return false;
    }
};

module.exports = removeCameraBan;
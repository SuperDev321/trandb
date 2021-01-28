const { Rooms, Users } = require('../../database/models');

const getUserIp = async (room, _id) => {
    let ip = null;
    const roomInfo = await Rooms.findOne({ name: room });
    if(roomInfo) {
    
        let liveUserData = roomInfo.users.find((item)=>(item._id.equals(_id)));
        console.log('live user', liveUserData, roomInfo.users)
        if(liveUserData)
            ip = liveUserData.ip;
    }
    return ip;
};

module.exports = getUserIp;

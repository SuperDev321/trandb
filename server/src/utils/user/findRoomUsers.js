const { Rooms, Users } = require('../../database/models');

const findRoomUsers = async (room, myRole) => {
    const roomInfo = await Rooms.findOne({ name: room });
    if(roomInfo) {
        const owner = roomInfo.owner;
        const moderators = roomInfo.moderators;
        let liveUserIds = roomInfo.users;
        const roomUsers = await Users.find({ _id: { $in: liveUserIds? liveUserIds: []  } }).lean();
        const usersInfo = roomUsers.map(({ _id, username, gender, role, avatar, ip, aboutMe, isMobile, avatarObj, currentAvatar, point, video }) => {
            // let ip;
            // // if(myRole === 'admin') {
            //     let result = roomInfo.users.find((item)=>(item._id.equals(_id)));
            //     ip = result.ip;
            // // }
            let userRole = role;
            if(role === 'normal') {
                if(_id.equals(owner)) {
                    userRole = 'owner';
                } else if(moderators.includes(_id)) {
                    userRole = 'moderator';
                } else {
                }
            }
            // if it don't show guest's about me field, it will return null on aboutMe field
            if (userRole === 'guest') {
                return { _id, username, gender, role: userRole, ip, avatar, aboutMe: null, isMobile, avatarObj, currentAvatar, point, video };    
            } else {
                return { _id, username, gender, role: userRole, ip, avatar, aboutMe, isMobile, avatarObj, currentAvatar, point, video };    
            }
        });
        return usersInfo;
    }
    return [];
    // console.log(roomUsers);
};

module.exports = findRoomUsers;

const { Rooms, Users, Settings } = require('../../database/models');

const findRoomUsers = async (room, myRole) => {
    const roomInfo = await Rooms.findOne({ name: room });
    const { guestAboutMe } = await Settings.findOne({ type: 'admin' });
    if(roomInfo) {
        const owner = roomInfo.owner;
        const moderators = roomInfo.moderators;
        let liveUserIds = roomInfo.users;
        const roomUsers = await Users.find({ _id: { $in: liveUserIds? liveUserIds: []  } });
        const usersInfo = roomUsers.map(({ _id, username, gender, role, avatar, ip, aboutMe, isMobile }) => {
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
            if (userRole === 'guest' && !guestAboutMe) {
                return { _id, username, gender, role: userRole, ip, avatar, aboutMe: null, isMobile };    
            } else {
                return { _id, username, gender, role: userRole, ip, avatar, aboutMe, isMobile };    
            }
        }
        );
        return usersInfo;
    }
    return [];
    // console.log(roomUsers);
};

module.exports = findRoomUsers;

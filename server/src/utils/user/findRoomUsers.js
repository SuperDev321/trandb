const { Rooms, Users } = require('../../database/models');

const findRoomUsers = async (room) => {
    const roomInfo = await Rooms.findOne({ name: room });
    const owner = roomInfo.owner;
    const moderators = roomInfo.moderators;
    console.log('owner', owner)
    if(roomInfo) {
        let liveUserIds = roomInfo.users.map((item) => (item._id));
        const roomUsers = await Users.find({ _id: { $in: liveUserIds? liveUserIds: []  } });
        const usersInfo = roomUsers.map(({ _id, username, gender, role, avatar }) =>{
            let userRole = role;
            console.log(_id, role)
            if(role === 'user') {
                console.log('user', _id, owner, _id == owner)
                if(_id.equals(owner)) {
                    console.log('set owner')
                    userRole = 'owner';
                } else if(moderators.includes(_id)) {
                    userRole = 'moderator';
                } else {
                    console.log('no')
                }
            }
            return {_id, username, gender, role: userRole};
        }// ({_id, username, gender, role, avatar }));
        );
        console.log(usersInfo)

        return usersInfo;
    }
    return [];
    // console.log(roomUsers);
};

module.exports = findRoomUsers;

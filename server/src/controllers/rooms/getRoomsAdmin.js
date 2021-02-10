const { Rooms, Bans, Users } = require('../../database/models');
const getRoomsAdmin = async (req, res, next) => {
    try {
        const rooms = await Rooms.aggregate([
            {
                $project: {
                    _id: true,
                    name: true,
                    description: true,
                    welcomeMessage: true,
                    category: true,
                    maxUsers: true,
                    password: true,
                    owner: true,
                    moderators: true,
                },
            },
        ]);
        let roomInfos = await Promise.all(rooms.map(async ({_id, name, description, welcomeMessage, category, maxUsers, password, owner, moderators}) => {
            let bans = await Bans.find({room: name});
            let {username} = await Users.findById(owner);
            let type = 'general';
            if(password) {
                type = 'private';
            }
            let moderatorData = await Users.find({_id: {$in: moderators? moderators: []}});
            moderatorData = moderatorData.map(({_id, username}) => ({_id, username}));

            return {_id, name, type, maxUsers, description, welcomeMessage, category, owner: username, moderators: moderatorData, bans};
        }))
        return res.json({
            statusCode: 200,
            data: roomInfos,
        });
    } catch (err) {
        return next(err);
    }
};

module.exports = getRoomsAdmin;

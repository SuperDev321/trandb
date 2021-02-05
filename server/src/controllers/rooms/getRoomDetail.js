const { Rooms, Bans, Users } = require('../../database/models');

const getRoomDetail = async (req, res, next) => {
    try {
        let {roomName} = req.params;
        
            if(roomName) {
                let {_id, name, owner, moderators, category, description, welcomeMessage, maxUsers, cover, icon} = await Rooms.findOne({name: roomName});
                let bans = await Bans.find({room: roomName});
                owner = await Users.findOne({_id: owner});
                bans = bans.map(({_id, username}) => ({_id, username}));
                moderators = await Users.find({ _id: { $in: moderators? moderators: [] } });
                return res.status(200).json({
                    statusCode: 200,
                    data: {_id, name, owner, moderators, category, description, welcomeMessage, maxUsers, cover, icon, bans, moderators},
            });
        } else {
            next(new Error('Can not get empty room'));
        }
    } catch (err) {
        return next(err);
    }
};

module.exports = getRoomDetail;

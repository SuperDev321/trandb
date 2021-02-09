const { Rooms, Bans, Users } = require('../../database/models');

const getRoomDetail = async (req, res, next) => {
    try {
        let {roomName} = req.params;
        let userId = req.userData._id;
        
        if(roomName) {
            let {_id, name, owner, moderators, category, description, welcomeMessage, maxUsers, cover, icon} = await Rooms.findOne({name: roomName});
            console.log(owner, userId)
            if(owner.equals(userId)) {
                let bans = await Bans.find({room: roomName});
                owner = await Users.findOne({_id: owner});
                bans = bans.map(({_id, username}) => ({_id, username}));
                moderators = await Users.find({ _id: { $in: moderators? moderators: [] } });
                moderators = moderators.map(({_id, username, role, gender}) => ({_id, username, role, gender}));
                return res.status(200).json({
                    statusCode: 200,
                    data: {_id, name, owner, moderators, category, description, welcomeMessage, maxUsers, cover, icon, bans, moderators},
                });
            } else {
                return res.status(403).json({
                    error: {
                        "code": 101, 
                        "msg": "You don't have permission for this"
                    }, 
                    statusCode: 403,
                });
            }
        } else {
            next(new Error('Can not get empty room'));
        }
    } catch (err) {
        return next(err);
    }
};

module.exports = getRoomDetail;

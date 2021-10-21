const { Rooms, Bans, Users } = require('../../database/models');
const ipInt = require('ip-to-int');
const ipToInt = require('ip-to-int');
const getRoomDetail = async (req, res, next) => {
    try {
        let {roomName} = req.params;
        let userId = req.userData._id;
        let role =  req.userData.role;
        
        if(roomName) {
            let {_id, name, owner, moderators, category, description, welcomeMessage, maxUsers, cover, icon} = await Rooms.findOne({name: roomName});
            if(owner.equals(userId) || role === 'admin' || role === 'super_admin') {
                let bans = await Bans.find({room: roomName, type: 'ip'});
                owner = await Users.findOne({_id: owner});
                bans = bans.map(({_id, username, ip}) => {
                    let realIp = ipToInt(ip).toIP();
                    return {_id, username, ip: realIp};
                });
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
        console.log(err);
        return next(err);
    }
};

module.exports = getRoomDetail;

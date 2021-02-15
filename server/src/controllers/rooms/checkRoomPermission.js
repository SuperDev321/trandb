const { Rooms } = require('../../database/models');

const checkRoomPermission = async (req, res, next) => {
    try {
        let {roomName} = req.params;
        if(roomName) {
            let {password} = await Rooms.findOne({name: roomName});
            if(password && password !== '') {
                return res.status(200).json({
                    statusCode: 200,
                    data: {isPrivate: true},
                });
            } else {
                return res.status(200).json({
                    statusCode: 200,
                    data: {isPrivate: false},
                });
            }
        } else {
            next(new Error('Can not get empty room'));
        }
    } catch (err) {
        return next(err);
    }
};

module.exports = checkRoomPermission;

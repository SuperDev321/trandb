const { Rooms } = require('../../database/models');
const getUserRooms = async (req, res, next) => {
    let {userId} = req.params;
    try {
        const rooms = await Rooms.find({owner: userId});
        let roomInfos = rooms.map(({_id, name}) =>({_id, name}));
        return res.json({
            statusCode: 200,
            data: roomInfos,
        });
    } catch (err) {
        return next(err);
    }
};

module.exports = getUserRooms;

const { Rooms } = require('../../database/models');
const getPublicRoomNames = async (req, res, next) => {
    try {
        let rooms = await Rooms.aggregate([
            
            {
                $project: {
                    name: true,
                    type: true,
                    users: { $size: '$users' }
                },
            },
        ]);
        rooms = rooms.filter((item) => (item.type !== 'private'))
        return res
            .status(200)
            .json({
                rooms,
            }
        );
    } catch (err) {
        console.log(err)
        return next(err);
    }
};

module.exports = getPublicRoomNames;

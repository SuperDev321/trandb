const { Rooms } = require('../../database/models');
const getPublicRoomNames = async (req, res, next) => {
    try {
        const rooms = await Rooms.aggregate([
            {
                $project: {
                    name: true,
                    users: { $size: '$users' }
                },
            },
        ]);
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

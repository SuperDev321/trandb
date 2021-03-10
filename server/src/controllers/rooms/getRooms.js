const { Rooms } = require('../../database/models');
const {findUserById} = require('../../utils')
const getRooms = async (req, res, next) => {
    try {
        const rooms = await Rooms.aggregate([
            {
                $project: {
                    _id: true,
                    name: true,
                    icon: true,
                    cover: true,
                    category: true,
                    maxUsers: true,
                    description: true,
                    welcomeMessage: true,
                    owner: true,
                    users: { $size: '$users' }
                },
            },
        ]);
        await Promise.all(rooms.map(async (room) => {
            let {username} = await findUserById(room.owner);
            room.owner = username;
            return room;
        }))
        return res
            .status(200)
            .json({
                statusCode: 200,
                data: rooms,
        });
    } catch (err) {
        console.log(err)
        return next(err);
    }
};

module.exports = getRooms;

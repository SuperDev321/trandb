const { Rooms } = require('../../database/models');
const getPrivateRoomNames = async (req, res, next) => {
    try {
        let rooms = await Rooms.aggregate([
            { $sort: { updated_at: -1 } },
            {
                $project: {
                    name: true,
                    type: true,
                    created_at: true,
                    updated_at: true
                },
            },
        ]);
        rooms = rooms.filter((item) => (item.type === 'private'))
        rooms = rooms.map((room) => {
            let name = room.name;
            let userNames = name.split('-');
            if (userNames && userNames.length === 2) {
                room.from = userNames[0]
                room.to = userNames[1]
            }
            return room
        })
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

module.exports = getPrivateRoomNames;

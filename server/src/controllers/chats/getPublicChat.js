const { Chats } = require('../../database/models');

const getPublicChat = async (req, res, next) => {
    try {
        let {roomName} = req.params;
        const chats = await Chats.find({
            type: 'public',
            room: roomName
        }).select({_id: 1, msg: 1, from: 1, room: 1, date: 1, color: 1, bold: 1}).lean();
        return res.json({
            statusCode: 200,
            data: chats,
        });
    } catch (err) {
        return next(err);
    }

}
module.exports = getPublicChat;
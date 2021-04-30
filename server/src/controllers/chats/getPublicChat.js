const { Chats } = require('../../database/models');

const getPublicChat = async (req, res, next) => {
    console.log('req');
    try {
        let {roomName} = req.params;
        const chats = await Chats.find({
            type: 'public',
            room: roomName
        });
        let chatInfos = chats.map(({_id, msg, from, room, date, color, bold}) => ({_id, msg, from, room, date, color, bold}));
        return res.json({
            statusCode: 200,
            data: chatInfos,
        });
    } catch (err) {
        return next(err);
    }

}
module.exports = getPublicChat;
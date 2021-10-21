const { Chats } = require('../../database/models');

const getPrivateChat = async (req, res, next) => {
    try {
        let {from, to} = req.body;
        const chats = await Chats.find({
            $or: [
                {$and: [{from} , {to}]},
                {$and: [{from: to}, {to: from}]}
            ]
        });

        let chatInfos = chats.map(({_id, msg, from, to, date, color, bold}) => ({_id, msg, from, to, date, color, bold}));
        return res.json({
            statusCode: 200,
            data: chatInfos,
        });
    } catch (err) {
        return next(err);
    }

}
module.exports = getPrivateChat;
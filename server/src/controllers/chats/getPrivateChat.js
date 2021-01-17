const { Chats } = require('../../database/models');

const getPrivateChat = async (req, res, next) => {
    console.log('req');
    try {
        let {from, to} = req.body;
        console.log(from, to);
        const chats = await Chats.find({
            $or: [ 
                {$and: [{from} , {to}]},
                {$and: [{from: to}, {to: from}]}
            ]
        });
        let chatInfos = chats.map(({msg, from, to, date}) => ({msg, from, to, date}));
        return res.json({
            statusCode: 200,
            data: chatInfos,
        });
    } catch (err) {
        return next(err);
    }

}
module.exports = getPrivateChat;
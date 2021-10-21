const { Chats } = require('../../database/models');

const getAllChats = async (req, res, next) => {
    try {
        const chats = await Chats.find({});
        return res.json({
            statusCode: 200,
            data: chats,
        });
    } catch (err) {
        return next(err);
    }

}
module.exports = getAllChats;
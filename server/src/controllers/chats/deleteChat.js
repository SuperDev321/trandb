const {Chats} = require('../../database/models');

const deleteRoom = async (req, res) => {
    try {
        const {id} = req.params;
        let chat = await Chats.findById(id);
        if(chat) {
            await Chats.remove({_id: id});
            res
            .status(204)
            .json({})
        } else {
            res
            .status(409)
            .json({
                error: 'Already deleted'
            })
        }
    } catch (err) {
        console.log(err)
        res
        .status(400)
        .json({
            error: 'Bad request'
        })
    }
}
module.exports = deleteRoom
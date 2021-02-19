const {Rooms} = require('../../database/models');

const deleteRoom = async (req, res) => {
    try {
        const {id} = req.params;
        let room = await Rooms.findById(id);
        if(room) {
            await Rooms.remove({_id: id});
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
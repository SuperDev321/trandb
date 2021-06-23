const Gifts = require("../../database/models/Gifts");


const deleteGift = async (req, res, next) => {
    try {
        const { id: _id } = req.params;
        let result = await Gifts.deleteOne({ _id });
        if (result) {
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
        console.log(err);
        next(err)
    }
}

module.exports = deleteGift;
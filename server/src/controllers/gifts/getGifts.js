const Gifts = require("../../database/models/Gifts")

const getGifts = async (req, res, next) => {
    try {
        const gifts = await Gifts.find({});
        if(gifts) {
            res
            .status(200)
            .json({
                gifts
            })
        } else {
            res
            .status(404)
            .json({
                error: 'no gifts',
                message: 'Can not find gifts'
            });
        }
    } catch (err) {
        
    } 
}

module.exports = getGifts;
const {Boots} = require('../../database/models')

const get = async (req, res, next) => {
    try {
        let boots = await Boots.find({})
        if(boots) {
            res
            .status(200)
            .json({
                message: 'success',
                boots
            })
        } else {
            res
            .status(500)
            .json({
                message: 'Can not get boots'
            })
        }
    } catch (err) {
        next(err);
    }
    
}

module.exports = get;
const {Quizes} = require('../../database/models');

const getQuizes = async (req, res, next) => {
    try {
        let quizes = await Quizes.find({});
        if(quizes) {
            res
            .status(200)
            .json({
                quizes
            })
        } else {
            res
            .status(404)
            .json({
                error: 'no quizes',
                message: 'Can not find quizes'
            });
        }
    } catch (err) {
        console.log(err);
        next(err);
    }
    
}

module.exports = getQuizes;
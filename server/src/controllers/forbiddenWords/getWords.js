const {ForbiddenWords} = require('../../database/models');

const getWords = async (req, res) => {
    try {
        let words = await ForbiddenWords.find({});
        if(words) {
            res
            .status(200)
            .json({words})
        } else {
            res
            .status(400)
            .json({
                error: 'No words'
            })
        }
    } catch (err) {
        res
        .status(400)
        .json({
            error: 'Bad request'
        })
    }
}
module.exports = getWords;
const {ForbiddenWords} = require('../../database/models');

const addWord = async (req, res) => {
    try {
        const {word} = req.body;
        if(word) {
            let oldWord = await ForbiddenWords.findOne({word});
            if(!oldWord) {
                await ForbiddenWords.create({word});
                res
                .status(204)
                .json({})
            } else {
                res
                .status(409)
                .json({
                    error: 'Already exits'
                })
            }
            
        }
    } catch (err) {
        res
        .status(400)
        .json({
            error: 'Bad request'
        })
    }
}
module.exports = addWord
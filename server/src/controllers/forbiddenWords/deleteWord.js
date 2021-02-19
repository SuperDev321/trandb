const {ForbiddenWords} = require('../../database/models');

const deleteWord = async (req, res) => {
    try {
        const {id} = req.params;
        let oldWord = await ForbiddenWords.findById(id);
        if(oldWord) {
            await ForbiddenWords.remove({_id: id});
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
module.exports = deleteWord
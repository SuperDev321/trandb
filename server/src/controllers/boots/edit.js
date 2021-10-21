const {Boots} = require('../../database/models')

const edit = async (req, res, next) => {
    try {
        const {_id, content, active, color, size, bold} = req.body;
        if(_id && content) {
            let result = await Boots.updateOne({
                _id
            }, {
                content,
                active,
                color,
                size,
                bold
            })
            if(result) {
                res
                .status(204)
                .json({
                    message: 'success'
                })
            } else {
                res
                .status(500)
                .json({
                    message: 'create_error'
                })
            }
        }
    } catch (err) {
        console.log(err)
        next(err);
    }
    
}

module.exports = edit;
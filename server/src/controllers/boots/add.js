const {Boots} = require('../../database/models')

const add = async (req, res, next) => {
    try {
        const {content} = req.body;
        if(content) {
            let result = await Boots.create({
                content
            })
            if(result) {
                res
                .status(201)
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
        next(err);
    }
    
}

module.exports = add;
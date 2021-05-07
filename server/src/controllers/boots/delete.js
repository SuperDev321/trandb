const {Boots} = require('../../database/models')

const deleteBoot = async (req, res, next) => {
    try {
        const {id} = req.params;
        if(id) {
            let result = await Boots.remove({_id: id})
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
                    message: 'delete_error'
                })
            }
        }
    } catch (err) {
        console.log(err)
        next(err);
    }
    
}

module.exports = deleteBoot;
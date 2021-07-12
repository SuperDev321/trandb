const { Users } = require('../../database/models');
const updatePoint = async (req, res, next) => {
    try {
        const { _id, point } = req.body;
        if (_id) {
            const user = await Users.findById(_id);
            if (user) {
                await Users.updateOne({
                    _id
                }, {
                    point: point? point: 0
                });
                return res
                .status(204)
                .json({
                    message: 'success'
                })
            }
        }
        return res
        .status(400)
        .json({
            error: 'can not find user'
        })
    } catch (err) {
        return next(err);
    }
    
}

module.exports = updatePoint;
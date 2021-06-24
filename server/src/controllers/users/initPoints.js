const { Users } = require("../../database/models")

const initPoints = async (req, res) => {
    try {
        await Users.updateMany({
            role: {
                $in: [
                    'normal', 'admin', 'super_admin'
                ]
            }
        }, {
            point: 1000
        })
        res.status(204)
        .json({
        });
    } catch (err) {
        next(err);
    }
    
}

module.exports = initPoints;
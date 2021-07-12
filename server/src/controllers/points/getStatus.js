const pointMan = require('../../constructors/pointManager');

const getStatus = (req, res, next) => {
    try {
        const status = pointMan.getStatus();
        return res
        .status(200)
        .json({
            message: 'success',
            status
        });
    } catch (err) {
        next(err);
    }
}

module.exports = getStatus;
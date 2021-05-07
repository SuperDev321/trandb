const bootMan = require('../../constructors/bootManager');

const stop = (req, res, next) => {
    try {
        if(bootMan.stop()) {
            res
            .status(204)
            .json({
                message: 'success'
            })
        } else {
            res
            .status(500)
            .json({
                message: 'stop_error'
            })
        }
    } catch (err) {
        next(err);
    }
}
module.exports = stop;
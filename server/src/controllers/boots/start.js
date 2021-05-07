const bootMan = require('../../constructors/bootManager');

const start = (req, res, next) => {
    try {
        let {room, interval} = req.body;
        if(room && interval) {
            if(bootMan.start(room, interval)) {
                res
                .status(204)
                .json({
                    message: 'success'
                })
            } else {
                res
                .status(500)
                .json({
                    message: 'start_error'
                })
            }
        }
    } catch (err) {
        next(err);
    }
}
module.exports = start;
const pointMan = require('../../constructors/pointManager');

const start = (req, res, next) => {
    try {
        let {incValue, timeSpan} = req.body;
        if(incValue && timeSpan) {
            if(pointMan.start(timeSpan, incValue)) {
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
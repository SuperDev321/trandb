const { Users } = require("../database/models");
class PointManager {
    constructor (timeSpan = 1, incValue = 10) {
        this.timer = null;
        this.timeSpan = timeSpan;
        this.incValue = incValue;
        this.io = null;
    }

    init(io) {
        this.io = io;
    }

    start () {
        this.timer = setInterval(async () => {
            await Users.updateMany({
                isInChat: true  
            }, {
                $inc: {
                    point: this.incValue
                }
            })
            this.io.emit('update user');
        }, this.timeSpan * 60000 );
    }
}

const pointMan = new PointManager();

module.exports = pointMan;
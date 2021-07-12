const { Users, Settings } = require("../database/models");
class PointManager {
    constructor (timeSpan = 1, incValue = 10) {
        this.timer = null;
        this.timeSpan = null;
        this.incValue = null;
        this.io = null;
    }

    init(io) {
        this.io = io;
    }

    start (timeSpan = 1, incValue = 10) {
        try {
            this.stop();
            this.timer = setInterval(async () => {
                await Users.updateMany({
                    isInChat: true  
                }, {
                    $inc: {
                        point: incValue
                    }
                })
                const liveUsers = await Users.find({ isInChat: true });
                const usersWithPoints = liveUsers.map(({ _id, username, point }) => {
                    return { _id, username, point };
                })
                this.io.emit('update points', usersWithPoints);
            }, timeSpan * 60000 );
            this.incValue = incValue;
            this.timeSpan = timeSpan;
            return true
        } catch (err) {
            console.log(err)
            return false
        }
    }

    stop () {
        try {
            if (this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            this.incValue = null;
            this.timeSpan = null;
            return true;
        } catch (err) {
            console.log(err)
            return false;
        }
    }

    getStatus () {
        const result = {
            running: this.timer? true: false,
            timeSpan: this.timeSpan,
            incValue: this.incValue
        }
        return result;
    }
}

const pointMan = new PointManager();

module.exports = pointMan;
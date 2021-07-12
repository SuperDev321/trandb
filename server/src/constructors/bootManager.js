const {Boots} = require('../database/models');
class BootManager {
    constructor () {
        this.open = false;
        this.timer = null;
        this.bootNum = 0;
        this.room = null;
        this.io = null;
    }

    init(io) {
        this.io = io;
    }

    start(room, interval) {
        try {
            if(this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            this.room = room;
            this.timer = setInterval(async () => {
                let boots = await Boots.find({active: true});
                if(this.bootNum >= boots.length) {
                    this.bootNum = 0;
                }
                let boot = boots[this.bootNum];
                if(this.io && boot && boot.content) {
                    let {content, size, bold, color} = boot;
                    this.io.to(room).emit('room message', {
                        type: 'public',
                        room,
                        msg: content,
                        size,
                        bold,
                        color,
                        messageType: 'boot'
                    });
                }
                this.bootNum ++;
            }, interval * 1000);
            return true;
        } catch (err) {
            return false;
        }
    }

    stop() {
        this.room = null;
        if(this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        return true;
    }

}

const bootMan = new BootManager();

module.exports = bootMan;
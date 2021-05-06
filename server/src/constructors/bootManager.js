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

    start(room) {
        try {
            if(this.timer) {
                clearInterval(this.timer);
                this.timer = null;
            }
            this.room = room;
            this.timer = setInterval(async () => {
                let boots = await Boots.find({});
                if(this.bootNum >= boots.length) {
                    this.bootNum = 0;
                }
                let boot = boots[this.bootNum];
                console.log('boot message', boot)
                if(this.io && boot && boot.content) {
                    this.io.to(room).emit('room message', {
                        type: 'public',
                        room,
                        msg: boot.content,
                        messageType: 'boot'
                    });
                }
                this.bootNum ++;
            }, 20000);
            return true;
        } catch (err) {
            return false;
        }
    }

    stop() {
        // if(this.room === room) {
        this.room = null;
        if(this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        return true;
        // }
    }

}

const bootMan = new BootManager();

module.exports = bootMan;
const { Users, Gifts } = require("../database/models");

const sendGift = (io, socket) => async ({to, giftId}, callback) => {
    try {
        const { _id, role } = socket.decoded;
        const sender = await Users.findById(_id);
        const receiver = await Users.findOne({ username: to })
        const gift = await Gifts.findById(giftId);
        if (sender && receiver && gift) {
            const { cost } = gift;
            const { point: senderPoint } = sender;
            const { point: receiverPoint } = receiver;
            if (senderPoint && senderPoint > cost) {
                let tmpPoint = 0;
                if (receiverPoint) {
                    tmpPoint = receiverPoint + cost/2;
                } else {
                    tmpPoint = cost/2;
                }
                await Users.updateOne({ username: to }, { point: tmpPoint });
                await Users.updateOne({ _id }, { point: senderPoint - cost });

                const socketIds = await io.of('/').in(receiver._id.toString()).allSockets();
                const it = socketIds.values();
                const first = it.next();
                const id = first.value;
                const socketToGift = io.sockets.sockets.get(id);
                if(socketToGift) {
                    socketToGift.emit('received gift', {
                        gift,
                        from: sender,
                    })
                    return callback(true);
                } else {
                    return callback(false)
                }
            } else {
                callback(false);
            }
            
        }       
    } catch (err) {
        console.log(err)
    }
}

module.exports = { sendGift }
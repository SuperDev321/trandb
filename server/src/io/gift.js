const { Users, Gifts } = require("../database/models");

const sendGift = (io, socket) => async ({to, giftId, room, amount}, callback) => {
    try {
        const { _id, role } = socket.decoded;
        const sender = await Users.findById(_id);
        const receiver = await Users.findOne({ username: to })
        const gift = await Gifts.findById(giftId);
        if (sender && receiver && gift && amount) {
            const { cost } = gift;
            const { point: senderPoint } = sender;
            const { point: receiverPoint } = receiver;
            const totalCost = cost * amount;
            if (senderPoint && senderPoint > totalCost) {
                let tmpPoint = 0;
                if (receiverPoint) {
                    tmpPoint = receiverPoint + totalCost/2;
                } else {
                    tmpPoint = totalCost/2;
                }
                await Users.updateOne({ username: to }, { point: tmpPoint });
                await Users.updateOne({ _id }, { point: senderPoint - totalCost });

                io.to(room).emit('received gift', {
                    gift,
                    from: sender.username,
                    to: receiver.username,
                    room,
                    amount
                })
                callback(true)
                // const socketIds = await io.of('/').in(receiver._id.toString()).allSockets();
                // const it = socketIds.values();
                // const first = it.next();
                // const id = first.value;
                // const socketToGift = io.sockets.sockets.get(id);
                // if(socketToGift) {
                //     socketToGift.emit('received gift', {
                //         gift,
                //         from: sender.username,
                //         to: receiver.username
                //     })
                //     return callback(true);
                // } else {
                //     return callback(false)
                // }
            } else {
                callback(false);
            }
            
        }       
    } catch (err) {
        console.log(err)
    }
}

module.exports = { sendGift }
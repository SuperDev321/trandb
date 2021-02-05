const leavePrivate = (socket) => async (roomName) => {
    try {
        socket.leave(roomName);
    } catch (err) {
        console.log(err);
    }
};

module.exports = leavePrivate;

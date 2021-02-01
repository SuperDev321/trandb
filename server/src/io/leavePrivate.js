const leavePrivate = (socket) => async (roomName) => {
    try {
        console.log('leave private', roomName)
        socket.leave(roomName);
    } catch (err) {
        console.log(err);
    }
};

module.exports = leavePrivate;

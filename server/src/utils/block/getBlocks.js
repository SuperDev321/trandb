const {Blocks} = require("../../database/models")

const getRoomBlocks = (roomName) => {
    let blocks = Blocks.find({room: roomName, type: 'room'});
    return blocks;
}

const getGlobalBlocks = () => {
    let blocks = Blocks.find({type: 'all'});
}

module.exports = { getRoomBlocks, getGlobalBlocks };

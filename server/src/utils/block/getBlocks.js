const {Blocks, Users} = require("../../database/models")
const getRoomBlocks = (roomName) => {
    let blocks = Blocks.find({room: roomName, type: 'room'});
    return blocks;
}

const getGlobalBlocks = async () => {
    let blocks = await Blocks.find({type: 'all'});
    let blockNames = await blocks.map((item) => (item.username));
    blockNames = new Set(blockNames);
    blockNames = Array.from(blockNames);
    let blockIps = new Set();
    blocks.forEach(element => {
        if(element.ip) {
            blockIps.add(element.ip);
        }
    });
    blockIps = Array.from(blockIps);
    let blockedUsers = await Users.find({
        $or: [
            {username: {$in: blockNames}},
            {ip: {$in: blockIps}}
        ]
    });
    if(blockedUsers && blockedUsers.length > 0)
        blockedUsers = blockedUsers.map((item) => (item.username));
    else blockedUsers = [];
    return blockedUsers;
}

const getBlocks = async (roomName) => {
    let blocks = await Blocks.find({
        room: roomName, type: 'room'
    });
    if(!blocks) {
        return [];
    }
    let blockNames = await blocks.map((item) => (item.username));
    blockNames = new Set(blockNames);
    blockNames = Array.from(blockNames);
    let blockIps = new Set();
    blocks.forEach(element => {
        if(element.ip) {
            blockIps.add(element.ip);
        }
    });
    blockIps = Array.from(blockIps);
    let blockedUsers = await Users.find({
        $or: [
            {username: {$in: blockNames}},
            {ip: {$in: blockIps}}
        ]
    });
    if(blockedUsers && blockedUsers.length > 0)
        blockedUsers = blockedUsers.map((item) => (item.username));
    else blockedUsers = [];
    return blockedUsers;
}

module.exports = { getRoomBlocks, getGlobalBlocks, getBlocks };

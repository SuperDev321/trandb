const {Blocks} = require("../../database/models")
const ipInt = require('ip-to-int');
const checkBlock = async (roomName, username, ipNum) => {
    let block = await Blocks.findOne({
        $or: [
            {room: roomName, username, type: 'room'},
            {room: roomName, ip: ipNum, type: 'room'},
            {username, type: 'all'},
            {ip: ipNum, type: 'all'},
        ]
        
    });
    
    return block? true :false;
}

module.exports = checkBlock;

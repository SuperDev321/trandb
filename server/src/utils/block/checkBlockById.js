const {Blocks, Users} = require("../../database/models");
const ipInt = require('ip-to-int');
const checkBlock = async (roomName, id) => {
    let user = await Users.findById(id);
    if(user) {
        let {username, ip} = user;
        let block = await Blocks.findOne({
            $or: [
                {room: roomName, username, type: 'room'},
                {room: roomName, ip, type: 'room'},
                {username, type: 'all'},
                {ip, type: 'all'},
            ]
        });
        return block? true :false;
    } {
        return false;
    }
    
}

module.exports = checkBlock;

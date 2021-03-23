const { Rooms, Chats, Users } = require('../database/models');

const { findRoomUsers, checkBan, getRoomBlocks, getGlobalBlocksWithIp, checkBlock } = require('../utils');
const ipInt = require('ip-to-int');
const joinRoom = (io, socket) => async ({ room, password }, callback) => {
    try {
        const { _id, role } = socket.decoded;
        let roomInfo = await Rooms.findOne({name: room});
        if(roomInfo.password && roomInfo.password !== '') {
            if(password !== roomInfo.password) {
                return callback(false, 'Wrong password');
            }
        }
        let user = await Users.findOne({_id});
        let {isBan, banType} = await checkBan(room, user.username, user.ip);
        if(isBan) {
            return callback(false, banType? 'banned_from_owner': 'banned_from_admin');
        }
        let result = await Rooms.updateOne({ name: room }, { $addToSet: { users: _id} });
        
        socket.join(room);
        callback(true)
        
        const messages = await Chats.find({ room, type: 'public' }).sort({date: -1}).limit(30);
        const usersInfo = await findRoomUsers(room, user.role);
        let onlineUsers = await Promise.all(usersInfo.map(async ({_id, username, ip, role, gender, avatar}) => {
            let item = {};
            let blocked = await checkBlock(room, username, ip);
            item.blocked = blocked;
            // if(user.role === 'admin' || user.role === 'super-admin') {
            item.ip = ipInt(ip).toIP();
            // }
            item._id = _id;
            item.username = username;
            item.role = role;
            item.gender = gender;
            item.avatar = avatar;
            return item;
        }));

        const globalBlocks = await getGlobalBlocksWithIp();
        const blocks = await getRoomBlocks(room);
        let blocked = await checkBlock(room, user.username, user.ip);
        socket.emit('init room',
            {messages, onlineUsers, room: {name: room, welcomeMessage: roomInfo.welcomeMessage}, blocks, globalBlocks},
            (data)=> {
                if(data === 'success') {
                    
                    io.to(room).emit('joined room', {room, onlineUsers: usersInfo,
                        joinedUser: {
                            _id: user._id,
                            username: user.username,
                            role: user.role,
                            gender: user.gender,
                            ip: ipInt(user.ip).toIP(),
                            blocked,
                            avatar: user.avatar
                        }
                    });
                }
            }
        );

        
    } catch (err) {
        console.log(err);
        callback(false, 'You cannot join to this room')
    }
};

const rejoinRoom = (io, socket) => async ({ room, type }, callback) => {
    try {
        const { _id, role } = socket.decoded;
        let ip = socket.client.request.headers['cf-connecting-ip'] || socket.client.request.headers['x-forwarded-for'] || socket.client.request.connection.remoteAddress
        // if(isIp(ip)) {
        //     if(!isIp.v4(ip)) {
        //         var address = new Address6(ip);
        //         var teredo = address.inspectTeredo();
        //         ip = teredo.client4;
        //     }
        //     if (ip.substr(0, 7) === '::ffff:') {
        //         ip = ip.substr(7);
        //     }
        // } else {
        //     ip = '10.10.10.10';
        // }
        if(type === 'public') {
            let user = await Users.findOne({_id});
            let {isBan, banType} = await checkBan(room, user.username, user.ip);
            if(isBan) {
                return callback(false, banType? 'banned_from_owner': 'banned_from_admin');
                
            }
            let result = await Rooms.updateOne({ name: room }, { $addToSet: { users: _id } });
            socket.join(room);
            // let {welcomeMessage} = await Rooms.findOne({name: room});
            const messages = await Chats.find({ room, type: 'public' }).sort({date: -1}).limit(30);
            const usersInfo = await findRoomUsers(room, user.role);
            let onlineUsers = await Promise.all(usersInfo.map(async ({_id, username, ip, role, gender, avatar}) => {
                let item = {};
                let blocked = await checkBlock(room, username, ip);
                item.blocked = blocked;
                // if(user.role === 'admin' || user.role === 'super-admin') {
                item.ip = ipInt(ip).toIP();
                // }
                item._id = _id;
                item.username = username;
                item.role = role;
                item.gender = gender;
                item.avatar = avatar;
                return item;
            }));
            let globalBlocks = await getGlobalBlocks();
            let blocks = await getBlocks(room);
            socket.emit('init room', {messages, onlineUsers, room: {name: room}, globalBlocks, blocks}, (data)=> {
                if(data === 'success' && result && result.nModified) {
                    io.to(room).emit('joined room', {room, onlineUsers: usersInfo,
                        joinedUser: {
                            _id: user._id,
                            username: user.username,
                            role: user.role,
                            gender: user.gender,
                            avatar: user.avatar,
                            ip: ipInt(user.ip).toIP()
                        }});
                }
            });
            return callback(true);
        } else if(type === 'private') {
            socket.join(room);
            return callback(true);
        }
        return callback(false, 'type_error')
    } catch (err) {
        callback(false)
    }
};
module.exports = {joinRoom, rejoinRoom};

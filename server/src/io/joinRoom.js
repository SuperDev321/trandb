const { Rooms, Chats, Users, Settings } = require('../database/models');

const { findRoomUsers, checkBan, getRoomBlocks, getGlobalBlocksWithIp, checkBlock,
    getGlobalCameraBans, getRoomCameraBans } = require('../utils');
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
        await Users.updateOne({ _id }, { video: null });
        let user = await Users.findOne({_id}).lean();
        let {isBan, banType} = await checkBan(room, user.username, user.ip);
        const {bypassBan} = await Settings.findOne({type: 'admin'});
        if (isBan && !bypassBan) {
            return callback(false, 'banned_from_room')
        }

        // baned guest user can't join to chat
        if(isBan && (!banType && user.role ==='guest')) {
            // return callback(false, banType? 'banned_from_owner': 'banned_from_admin');
            return callback(false, 'info_banned');
        } else if (isBan && banType) {
            return callback(false, 'banned_from_room')
        }
        let result = await Rooms.updateOne({ name: room }, { $addToSet: { users: _id} });
        
        socket.join(room);
        if (isBan) {
            callback(true)
        } else {
            callback(true)
        }
        const messages = await Chats.find({ room, type: 'public' }).sort({date: -1}).limit(30);
        const usersInfo = await findRoomUsers(room, user.role);
        let onlineUsers = await Promise.all(usersInfo.map(async (item) => {
            const { username, ip } = item;
            const blocked = await checkBlock(room, username, ip);
            const ipStr = ipInt(ip).toIP();
            return { ...item, ip: ipStr, blocked };
        }));
        const globalBlocks = await getGlobalBlocksWithIp();
        const blocks = await getRoomBlocks(room);
        const globalCameraBans = await getGlobalCameraBans();
        const cameraBans = await getRoomCameraBans(room);
        // let blocked = await checkBlock(room, user.username, user.ip);
        socket.emit('init room',
            {
                messages, onlineUsers, room: { name: room, welcomeMessage: roomInfo.welcomeMessage },
                blocks, globalBlocks, cameraBans, globalCameraBans
            },
            (data)=> {
                if(data === 'success' && result && result.nModified) {
                    let joinedUser = onlineUsers.find((item) => (item._id.equals(_id)));
                    io.to(room).emit('joined room', {
                        room,
                        onlineUsers,
                        joinedUser
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
        const { users: userIds } = await Rooms.findOne({ name: room });
        const isInRoom = userIds.includes(_id);
        await Users.updateOne({ _id }, { video: null });
        if(type === 'public') {
            
            let user = await Users.findOne({_id});
            let {isBan, banType} = await checkBan(room, user.username, user.ip);
            const {bypassBan} = await Settings.findOne({type: 'admin'});
            if (isBan && !bypassBan) {
                return callback(false, 'banned_from_room')
            }

            // baned guest user can't join to chat
            if(isBan && (!banType && user.role ==='guest')) {
                // return callback(false, banType? 'banned_from_owner': 'banned_from_admin');
                return callback(false, 'info_banned');
            } else if (isBan && banType) {
                return callback(false, 'banned_from_room')
            }
            let result = await Rooms.updateOne({ name: room }, { $addToSet: { users: _id } });
            socket.join(room);
            
            // let {welcomeMessage} = await Rooms.findOne({name: room});
            const messages = await Chats.find({ room, type: 'public' }).sort({date: -1}).limit(30);
            const usersInfo = await findRoomUsers(room, user.role);
            let onlineUsers = await Promise.all(usersInfo.map(async (item) => {
                const { username, ip } = item;
                const blocked = await checkBlock(room, username, ip);
                const ipStr = ipInt(ip).toIP();
                return { ...item, ip: ipStr, blocked };
            }));
            
            let globalBlocks = await getGlobalBlocksWithIp();
            let blocks = await getRoomBlocks(room);
            const globalCameraBans = await getGlobalCameraBans();
            const cameraBans = await getRoomCameraBans(room);
            // let blocked = await checkBlock(room, user.username, user.ip);
            
            socket.emit('init room', {
                messages, onlineUsers, room: {name: room},
                globalBlocks, blocks, cameraBans, globalCameraBans
            }, (data)=> {
                if(data === 'success' && result && result.nModified) {
                    let joinedUser = onlineUsers.find((item) => (item._id.equals(_id)));
                    if (!isInRoom) {
                        io.to(room).emit('joined room', {
                            room,
                            joinedUser,
                            onlineUsers,
                        });
                    }
                }
            });
            return callback(true);
        } else if(type === 'private') {
            socket.join(room);
            return callback(true);
        }
        return callback(false, 'type_error')
    } catch (err) {
        console.log(err)
        callback(false, err)
    }
};
module.exports = {joinRoom, rejoinRoom};

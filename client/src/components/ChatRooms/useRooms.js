import React, { useState, useReducer, useEffect, useContext, useRef, useCallback } from 'react';
import { socket, mediaSocket, useLocalStorage, isPrivateRoom } from '../../utils';
import {MediaClient, mediaEvents} from '../../utils';
import RoomObject from '../../utils/roomObject';
import {UserContext, SettingContext} from '../../context';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import {useAudio} from 'react-use';
import {permissionRequest} from './notification';

function makeid(length) {
    var result           = [];
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result.push(characters.charAt(Math.floor(Math.random() * 
        charactersLength)));
   }
   return result.join('');
}

function roomReducer(state, action) {
    switch (action.type) {
        case 'pending': {
            return {status: 'pending', data: state.data, error: null}
        }
        case 'init': {
            return {status: 'resolved', data: action.data, error: null}
        }
        case 'update': {
            if(state.data) {
                let {name: oldName} = state.data;
                let {name: newName} = action.data;
                if(oldName === newName) {
                    return {status: 'resolved', data: {...state.data, ...action.data}, error: null};
                }
            }
            return state;
        }
        case 'rejected': {
            return {status: 'rejected', data: null, error: action.error}
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}

function roomsReducer(state, action) {
    switch (action.type) {
        case 'add': {
            return {status: 'resolved', data: [...state.data, action.data], roomIndex: state.data.length, error: null}
        }
        case 'remove': {
            let {data} = state;
            let newData = data?.filter((item)=>(item.name !== action.data));
            if(Array.isArray(newData) && newData.length) {
                return {status: 'resolved', data, error: null};
            } else {
                return {status: 'rejected', data: null, error: 'remove all rooms'}
            }
        }
        case 'set': {
            return {
                status: 'resolved', data: action.data,
                roomIndex: ((!isNaN(action.roomIndex)) && action.roomIndex >= 0) ? action.roomIndex: state.roomIndex,
                error: null
            };
        }
        default: {
            throw new Error(`Unhandled action type: ${action.type}`)
        }
    }
}

const useRooms = ({initRoomName, ...initalState}) => {

    const history= useHistory();
    const roomsRef = useRef([]);
    const mediaClientRef = useRef(null);
    const [roomsState, roomsDispatch] = useReducer(roomsReducer, {
        status: 'idle',
        data: [],
        roomIndex: null,
        error: null,
    });
    const { username } = useContext(UserContext);
    const {enablePokeSound, enablePrivateSound, enablePublicSound, enableSysMessage, messageNum} = useContext(SettingContext);
    // current room state
    const [state, dispatch] = useReducer(roomReducer, {
        status: 'idle',
        data: null,
        error: null,
    });
    const [globalBlocks, setGlobalBlocks] = useState([]);
    const [mutes, setMutes] = useLocalStorage('mutes', []);
    const privateListRef = useRef();
    const [roomEvent, setRoomEvent] = useState(null);
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [openDisconnectModal, setOpenDisconnectModal] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [roomNameForPassword, setRoomNameForPassword] = useState('');

    const roomNameRef = React.useRef(initRoomName);

    const [pokeAudio, pokeAudioState, pokeAudioControls] = useAudio({
        src: '/media/poke.mp3',
        autoPlay: false ,
    });
    const [publicAudio, publicAudioState, publicAudioControls] = useAudio({
        src: '/media/public.mp3',
        autoPlay: false ,
    });
    const [privateAudio, privateAudioState, privateAudioControls] = useAudio({
        src: '/media/private.mp3',
        autoPlay: false ,
    });

    const [requestAudio, requestAudioState, requestAudioControls] = useAudio({
        src: '/media/request.mp3',
        autoPlay: false ,
    });

    const {status, data, error} = state;
    const {status: roomsStatus, data: roomsData, roomIndex, error: roomsError} = roomsState;

    const changeRoom = (newRoomIndex) => {
        let room = roomsRef.current[newRoomIndex];
        room.mergeUnreadMessages();
        data.name = room.name;
        data.messages = room.messages;
        data.users = room.onlineUsers;
        data.blocks = room.blocks;
        data.mutes = room.mutes
        data.unReadMessages = room.unReadMessages;
        data.users = room.users;
        data.localStream = mediaClientRef.current.getLocalStream(room.name);
        data.remoteStreams = mediaClientRef.current.getRemoteStreams(room.name);
        data.liveUsers = mediaClientRef.current.getLiveUsers(room.name);
        dispatch({type: 'init', data});
        roomNameRef.current = room.name;
        let newRoomsData = roomsRef.current.map(({name, unReadMessages}) => ({name, unReadMessages}));
        roomsDispatch({type: 'set', data: newRoomsData, roomIndex: newRoomIndex});
    }

    const initRoom = useCallback(async ({room, globalBlocks, onlineUsers, messages, blocks}) => {
        let data = {};
        if(roomsRef.current && room) {
            if(Array.isArray(globalBlocks)) {
                setGlobalBlocks(globalBlocks);
            }
            let sameRoom = roomsRef.current.find((item) => (item.name === room.name));
            if(!sameRoom) {
                let newMessages = null;
                if(room.welcomeMessage) {
                    let wcMsg = {
                        type: 'system',
                        msg: room.welcomeMessage
                    };
                    newMessages = [wcMsg, ...messages];
                }
                
                let newRoomObject = new RoomObject(room.name, newMessages? newMessages: messages, onlineUsers, blocks, messageNum);
                roomsRef.current.push(newRoomObject);
                data.name = room.name;
                data.messages = newRoomObject.messages;
                data.users = onlineUsers;
                data.blocks = blocks;
                data.mutes = newRoomObject.mutes
                data.unReadMessages = newRoomObject.unReadMessages;
                data.localStream = null;
                data.remoteStreams = null;
                data.liveUsers = null;
                dispatch({type: 'init', data});
                roomNameRef.current = room.name;
                roomsDispatch({type: 'add', data: {
                        name: room.name,
                        unReadMessages: newRoomObject.unReadMessages
                    }
                })
                // setRoomIndex(roomsRef.current.length-1);
            } else {
                if(blocks) {
                    sameRoom.updateBlocks(blocks);
                }
                if(onlineUsers) {
                    let users = onlineUsers.map((user) => ({...user}))
                    sameRoom.users = users;
                }
                if(messages) {
                    sameRoom.setMessages(messages);
                }
            }
            if(mediaClientRef.current) {
                // await mediaClientRef.current?.init();
                await mediaClientRef.current?.createRoom(room.name);
                await mediaClientRef.current?.join(room.name);
            }
        }
    }, [dispatch, roomsDispatch, messageNum]);

    const addRoom = useCallback(async (room, callback) => {
        let roomNames = await roomsRef.current.map((oneRoom) => (oneRoom.name));
        if(room && roomNames && !roomNames.includes(room)) {
            isPrivateRoom(room, ({isPrivate}) => {
                if(isPrivate) {
                    callback(false, 'password');
                } else {
                    socket.emit('join room', { room }, (result, message) => {
                        if(result) {
                            if (message) {
                                enqueueSnackbar(t(`ChatApp.${message}`, { roomName: room }), {variant: 'error'})
                            }
                        } else {
                            enqueueSnackbar(message, {variant: 'error'})
                        }
                    });
                }
            }, (err) => {
                console.log(err);
            })
        // socket.emit('join room', { room });
            callback(true);
        } else {
            callback(false, 'already_entered');
        }
    }, [])

    const addUser = useCallback(({room, joinedUser, onlineUsers}) => {
        if(roomsRef.current) {
            let sameRoom = roomsRef.current.find((item) => (item.name === room));
            if(sameRoom) {
                let usernames = onlineUsers.map((item) => (item.username));
                if(username && usernames.includes(username)) {
                    let newData = {name: room};
                    if(joinedUser) {
                        if(sameRoom.addOnlineUser(joinedUser)) {
                            if(username !== joinedUser.username && enableSysMessage) {
                                let sysMsg = {
                                    _id: makeid(10),
                                    type: 'joinLeave',
                                    msg: t('ChatApp.sys_join_room', {username: joinedUser.username})
                                    // msg: joinedUser.username + ' joined the room'
                                }
                                sameRoom.addMessages([sysMsg]);
                                newData.messages = sameRoom.messages;
                            }
                            newData.users = sameRoom.users;
                            dispatch({type: 'update',
                                data: newData
                            })
                        }
                    }
                }
            }
        }
    }, [enableSysMessage, username]);

    const removeUser = useCallback(({room, leavedUser}) => {
        if(roomsRef.current) {
            let sameRoom = roomsRef.current.find((item) => (item.name === room));
            if(sameRoom) {
                let leavedUserInfo = sameRoom.users.find((user) => (user._id === leavedUser));
                if(leavedUserInfo) {
                    let newData = {name: room};
                    sameRoom.removeOnlineUser(leavedUser);
                    newData.users = sameRoom.users;
                    if(enableSysMessage) {
                        let message = {
                            _id: makeid(10),
                            type: 'joinLeave',
                            msg: t('ChatApp.sys_leave_room', {username: leavedUserInfo.username}) 
                        }
                        sameRoom.addMessages([message]);
                        newData.messages = sameRoom.messages;
                    }
                    dispatch({type: 'update',
                        data: newData
                    })
                } else {
                    //you leaved from room by server
                }
            }
        }
    }, [enableSysMessage]);

    const kickUser = useCallback(({room, kickedUserName, type, role}) => {
        if(roomsRef.current && room) {
            let sameRoom = roomsRef.current.find((item) => (item.name === room));
            if(sameRoom) {
                let kickedUser = sameRoom.users.find(({username}) => (username === kickedUserName));
                if(username !== kickedUserName) { // kick other
                    if(kickedUser) {
                        sameRoom.removeOnlineUser(kickedUser._id);
                        let msg = (type === 'kick') 
                            ? t('ChatApp.sys_kick',{username: kickedUserName, roomName: room, userRole: role})
                            : t('ChatApp.sys_ban',{username: kickedUserName, roomName: room, userRole: role});
                        let message = {
                            _id: makeid(10),
                            type: 'joinLeave',
                            msg
                        }
                        sameRoom.addMessages([message]);
                        let newData = {
                            name: room,
                            messages: sameRoom.messages,
                            users: sameRoom.users
                        };
                        
                        dispatch({type: 'update',
                            data: newData
                        })
                    }
                    
                } else { // kick you
                    setRoomEvent({type: 'remove room', data: {room, reason: 'kick', role}});
                }
                
            }
        } else if(roomsRef.current.length && type === 'global ban') {
            if(username !== kickedUserName) {
                roomsRef.current.forEach((roomRef) => {
                 // kick other
                    let kickedUser = roomRef.users.find(({username}) => (username === kickedUserName));
                    if(kickedUser) {
                        roomRef.removeOnlineUser(kickedUser._id);
                        let msg = t('ChatApp.sys_ban', {username: kickedUserName, roomName: 'all rooms', userRole: 'admin'});
                        let message = {
                            _id: makeid(10),
                            type: 'joinLeave',
                            msg
                        }
                        roomRef.addMessages([message]);
                        dispatch({
                            type: 'update',
                            data: {
                                name: roomRef.name,
                                messages: roomRef.messages,
                                users: roomRef.users
                            }
                        })
                    }
                })
            }
            else { // kick you
                // remove all room
                roomsRef.current = null;
                history.push('/');
                let alertText = t('ChatApp.error_ban', {roomName: 'all rooms', userRole: 'admin'});
                enqueueSnackbar(alertText, {variant: 'error'});
            }
        }
    }, [username])

    const updateBlocks = useCallback(({room, blocks}) => {
        if(roomsRef.current && room) {
            let sameRoom = roomsRef.current.find((item) => (item.name === room));
            if(sameRoom && Array.isArray(blocks)) {
                sameRoom.updateBlocks(blocks);
                dispatch({type: 'update', data: { name: room, blocks}});
            }
        }
    }, [dispatch]);

    const removeRoom = React.useCallback(async (room, callback) => {
        if(status === 'resolved' && roomsStatus === 'resolved') {
            let {name: currentRoomName} = data;
            let roomIndexToRemove = roomsRef.current.findIndex((item) => (item.name === room));
            let newRoomIndex = null;
            if(roomIndexToRemove >= 0) {
                if(room === currentRoomName) {
                    let newRoom = null;
                    if(roomIndex > 0) {
                        newRoom = roomsRef.current[roomIndex - 1];
                        newRoomIndex = roomIndex-1;
                    } else {
                        newRoom = roomsRef.current[1];
                        newRoomIndex = 0;
                    }
                    if(!newRoom) {
                        if(callback) callback(true);
                        return history.push('/');
                    }
                    newRoom.mergeUnreadMessages();
                    let data = {};
                    data.name = newRoom.name;
                    data.messages = newRoom.messages;
                    data.users = newRoom.onlineUsers;
                    data.blocks = newRoom.blocks;
                    data.mutes = newRoom.mutes
                    data.unReadMessages = newRoom.unReadMessages;
                    data.users = newRoom.users;
                    data.localStream = mediaClientRef.current.getLocalStream(newRoom.name);
                    data.remoteStreams = mediaClientRef.current.getRemoteStreams(newRoom.name);
                    data.liveUsers = mediaClientRef.current.getLiveUsers(newRoom.name);
                    dispatch({type: 'init', data});
                    roomNameRef.current = newRoom.name;
                }
                let newRooms = await(roomsRef.current.filter((oneRoom) => (oneRoom.name !==room)));
                roomsRef.current = newRooms;
                
                if(newRoomIndex === null) {
                    newRoomIndex = roomsRef.current.findIndex((item) => (item.name === currentRoomName));
                }
                let newRoomsData = roomsRef.current.map(({name, unReadMessages}) => ({name, unReadMessages}));
                roomsDispatch({type: 'set', data: newRoomsData, roomIndex: newRoomIndex});
                
                if(callback) callback(true);
            } else {
                if(callback) callback(false);
            }
        }
        if(mediaClientRef.current) {
            mediaClientRef.current.exitRoom(room);
        }
    }, [status, roomsStatus, roomIndex, data])

    const changeMuteState = useCallback((roomName, userToMute, isMuted) => {
        let room = roomsRef.current.find((item) => (item.name === roomName));
        if(room) {
            if(isMuted) {
                let newMutes = mutes.filter((item) => (
                    item.room !== roomName ||
                    (item.username !== userToMute.username &&
                    (!item.ip || !userToMute.ip || (item.ip !== userToMute.ip)))
                ));
                setMutes(newMutes);
                if(!room.deleteMute(userToMute)) {
                    enqueueSnackbar('This user was blocked', {variant: 'error'});
                }
            } else {
                let localMute = mutes.find((item) => (item.room === roomName
                    && item.username === userToMute.username
                    && item.ip === userToMute.ip))
                if(!localMute) {
                    let newMutes = [...mutes, {room: roomName, username: userToMute.username, ip: userToMute.ip}];
                    setMutes(newMutes);
                }
                // if(!userInfo || (userInfo && !userInfo.blocked)) {
                    room.addMute(userToMute);
                // }
                
            }
            let {name: currentRoomName} = data;
            if(currentRoomName === roomName) {
                dispatch({
                    type: 'update',
                    data: {
                        name: roomName,
                        mutes: room.mutes
                    }
                })
            }
        }
    }, [data, mutes])

    const receiveMessage = useCallback(({message}, callback) => {
        if(message) {
            if(message.type === 'public') {
                let room = roomsRef.current.find((item) => (item.name === message.room))
                if(room && message.msg) {
                    if(message.msg) {
                        let userToReceive = room.users.find((item) => (item.username === message.from));
                        if(userToReceive && !room.checkMuteByName(message.from)) {
                            publicAudioControls.seek(0);
                            publicAudioControls.play();
                        }
                        if(roomNameRef.current !== room.name) {
                            room.addUnreadMessage(message);
                        } else {
                            room.addMessages([message]);
                        }
                    }
                    
                    if(roomNameRef.current === room.name) {
                        dispatch({
                            type: 'update',
                            data: {
                                name: room.name,
                                messages: room.messages,
                            }
                        })
                    }
                } 
                
            } else if(message.type==='private' && privateListRef.current && message.msg && message.to) {
                if(privateListRef.current.addMessage(message, message.roomName)) {
                    privateAudioControls.seek(0);
                    privateAudioControls.play();
                    if (callback) {
                        callback('success')
                    }
                } else {
                    if (callback) {
                        callback('muted')
                    }
                }
            }
            let infos = roomsRef.current.map(({name, unReadMessages}) => ({name, unReadMessages}));
            roomsDispatch({type: 'set', data: infos});
        }
    }, []);

    const receivePoke = useCallback((pokeMessage, callback) => {
        let {room} = pokeMessage;
        if(roomsRef.current && room) {
            let sameRoom = roomsRef.current.find((item) => (item.name === room));
            if(sameRoom) {
                if(pokeMessage.to === username) {
                    let message = {
                        _id: makeid(10),
                        type: 'poke',
                        from: pokeMessage.from,
                        msg: t('PokeMessage.have_poked_you', {username: pokeMessage.from}) 
                    }
                    sameRoom.addMessages([message]);
                    let userToReceive = sameRoom.users.find((item) => (item.username === pokeMessage.from));
                    if(userToReceive && !sameRoom.checkMuteByName(pokeMessage.from)) {
                        pokeAudioControls.seek(0);
                        pokeAudioControls.play();
                        callback(true)
                    } else {
                        callback(false)
                    }
                    dispatch({
                        type: 'update',
                        data: {
                            name: room,
                            messages: sameRoom.messages
                        }
                    })
                }
            }
        }
    }, [username]);

    const addMessage = useCallback(({message, room}) => {
        let sameRoom = roomsRef.current.find((item) => (item.name) === room);
        if(sameRoom) {
            sameRoom.addMessages([message]);
            dispatch({
                type: 'update',
                data: {
                    name: room,
                    messages: sameRoom.messages
                }
            })
        }
    }, [])

    useEffect(() => {
        if(initRoomName && username) {
            socket.open();
            mediaSocket.open();
            socket.on('connect_error', (err) => {
                console.log(err)
            })
            socket.on('init room', async ({room, onlineUsers, messages, blocks, globalBlocks}, fn) => {
                fn('success');
                let usernames = await onlineUsers.map((item) => (item.username));
                if(usernames.includes(username)) {
                    initRoom({room, onlineUsers, messages, blocks, globalBlocks});
                }
            });
            
            socket.on('update block', ({room, blocks}) => {
                updateBlocks({room, blocks});
            })
            socket.on('update global block', ({blocks}) => {

                setGlobalBlocks(blocks);
            })
            socket.on('room message', (message, callback) => {
                
                receiveMessage({message}, callback);
            });
            socket.on('private message', (message, callback) => {
            })
            socket.on('poke message', (payload, callback) => {
                receivePoke(payload, callback)
            })

            // socket.on('join error', payload => {
            //    joinErrorHandler(payload);
            // })

            socket.on('disconnect', (reason) => {
                setOpenDisconnectModal(true);
                if (reason === 'io server disconnect') {
                    // the disconnection was initiated by the server, you need to reconnect manually
                    socket.connect();
                }
            })

            socket.io.on('reconnect', async () => {
                let roomNames = roomsRef.current.map((room) => (room.name));
                let privateRooms = privateListRef.current ? privateListRef.current.getPrivateRooms(): [];
                roomNames.map(async (roomName) => {
                    socket.emit('rejoin room',{room: roomName, type: 'public'}, (result, error) => {
                        if(result) {
                            // console.log('rejoin success') 
                        } else {
                            // console.log('rejoin fail', error)
                        }
                        
                    })
                });
                privateRooms.forEach((roomName) => {
                    socket.emit('rejoin room',{room: roomName, type: 'private'}, (result) => {
                        if(result) {
                            // console.log('rejoin success')
                        } else {
                            // console.log('rejoin fail')
                        }
                        
                    })
                })
                setOpenDisconnectModal(false)
            })

            socket.io.on('reconnect_attempt', () => {
                // console.log('reconnect_attempt');
            })

            socket.on('repeat connection', () => {
                enqueueSnackbar(t('ChatApp.already_in_chat'), {variant: 'error'});
                history.push('/');
            })

            mediaSocket.on('view request', ({username, roomName}, callback) => {
                requestAudioControls.seek(0);
                requestAudioControls.play();
                permissionRequest(username, roomName, (result) => {
                    callback(result);
                });
            })

            isPrivateRoom(initRoomName, ({isPrivate}) => {
                if(isPrivate) {
                    setRoomNameForPassword(initRoomName);
                    setOpenPasswordModal(true);
                } else {
                    socket.emit('join room', { room: initRoomName }, (result, message) => {
                        if(!result) {
                            if(message)
                                enqueueSnackbar(t('ChatApp.'+message, {roomName: initRoomName}), {variant: 'error'});
                            dispatch({type: 'rejected', error: 'joine error'});
                        } else {
                            if (message) {
                                enqueueSnackbar(t('ChatApp.'+message, {roomName: initRoomName}), {variant: 'info'});
                            }
                        }
                    });
                }
            }, (err) => {
                console.log(err);
            })
        }

        return () => {
            socket.removeAllListeners();
            socket.io.removeAllListeners();
            mediaSocket.removeAllListeners();
            mediaSocket.io.removeAllListeners();
            socket.close();
            mediaSocket.close();
            // socket.off('connect_error');
            // socket.off('init room');
            // socket.off('update block');
            // socket.off('update global block');
            // socket.off('room message');
            // socket.off('private message');
            // socket.off('poke message');
            // socket.off('disconnect');
            // socket.off('repeat connection');
            // socket.io.off('reconnect');
            // socket.io.off('reconnect_attempt')
            // mediaSocket.off('view request');
        };
    }, [initRoomName, username]);

    useEffect(() => {
        socket.on('joined room',async ({room, onlineUsers, joinedUser}) => {
            addUser({room, onlineUsers, joinedUser});
        });
        socket.on('leave room', async ({room, onlineUsers, leavedUser}) => {
            removeUser({room, leavedUser});
        });
        socket.on('kicked user', async ({room, kickedUserName, role}) => {
            console.log(role)
            kickUser({room, kickedUserName, type: 'kick', role});
        });
        socket.on('banned user', async ({room, kickedUserName, role}) => {
            kickUser({room, kickedUserName, type: 'ban', role}); 
        });
        socket.on('global banned user', async ({kickedUserName, role}) => {
            kickUser({kickedUserName, type: 'global ban', role}); 
        });

        return () => {
            socket.off('joined room');
            socket.off('leave room');
            socket.off('banned user');
            socket.off('global banned user');
        }
    }, [enableSysMessage, username])

    useEffect(() => {
        let mediaObj = new MediaClient(username);
        mediaObj.init();
        mediaObj.on(mediaEvents.onChangeConsume, (data) => {
            let {room_id} = data;
            let liveUsers = mediaClientRef.current.getLiveUsers(room_id);
            dispatch({
                type: 'update',
                data: {
                    name: room_id,
                    liveUsers
                }
            })
            // setMediaEvent({room_id, event: 'consume'});
        })
        mediaObj.on(mediaEvents.onChangeRemoteStreams, (data) => {
            let {room_id} = data;
            let remoteStreams = mediaClientRef.current.getRemoteStreams(room_id);
            dispatch({
                type: 'update',
                data: {
                    name: room_id,
                    remoteStreams
                }
            })
            // setMediaEvent({room_id, event: 'remote streams'});
        })

        mediaObj.on(mediaEvents.startStream, (data) => {
            let {room_id} = data;
            let stream = mediaObj.getLocalStream(room_id);
            dispatch({
                type: 'update',
                data: {
                    name: room_id,
                    localStream: stream
                }
            })
        })

        mediaObj.on(mediaEvents.stopStream, (data) => {
            let {room_id} = data;
            dispatch({
                type: 'update',
                data: {
                    name: room_id,
                    localStream: null
                }
            })
        })

        mediaObj.on(mediaEvents.changeViewers, (data) => {
            let {room_id} = data;
            let viewers = mediaClientRef.current.getViewers(room_id);
            dispatch({
                type: 'update',
                data: {
                    name: room_id,
                    viewers
                }
            })
        })

        let old = mediaClientRef.current;

        if(mediaClientRef.current) {
            mediaClientRef.current = null;
        }

        mediaClientRef.current = mediaObj;

        return () => {
            if(mediaObj) {
                mediaObj.offAll();
                mediaObj.exit(true);
                mediaObj = null;
            }
            
        }
    }, [username])

    useEffect(() => {
        if(status === 'rejected') {
            history.push('/')
        }
    }, [status, history])

    useEffect(() => {
        if(roomEvent) {
            let {type, data} = roomEvent;
            switch(type) {
                case 'remove room':
                    let {room, reason, role} = data;
                    removeRoom(room, (result, message) => {
                        if(result) {
                            let alertText = (reason === 'kick') 
                                ?t('ChatApp.error_kicked', {roomName: room, userRole: role})
                                :t('ChatApp.error_ban', {roomName: room, userRole: role});
                            enqueueSnackbar(alertText, {variant: 'error'});
                        } else {
                            console.log(result, message)
                        }
                        
                    })
                    break;
                default:
                    break;
            }
        }
    }, [roomEvent, removeRoom])

    useEffect(() => {

        if(enablePokeSound) {
            pokeAudioControls.unmute();
        } else {
            pokeAudioControls.mute();
        }
    }, [enablePokeSound, pokeAudioControls])
    useEffect(() => {

        if(enablePublicSound) {
            publicAudioControls.unmute();
        } else {
            publicAudioControls.mute();
        }
    }, [enablePublicSound, publicAudioControls]);
    useEffect(() => {

        if(enablePrivateSound) {
            privateAudioControls.unmute();
        } else {
            privateAudioControls.mute();
        }
    }, [enablePrivateSound, privateAudioControls])

    return {
        status,
        data,
        error,
        roomsStatus,
        roomsData,
        roomsError,
        roomIndex,
        globalBlocks,
        privateListRef,
        changeRoom,
        removeRoom,
        addRoom,
        addMessage,
        changeMuteState,
        pokeAudio,
        privateAudio,
        publicAudio,
        requestAudio,
        openDisconnectModal,
        setOpenDisconnectModal,
        mediaClientRef,
        openPasswordModal,
        setOpenPasswordModal,
        roomNameForPassword
    }

}


export default useRooms;
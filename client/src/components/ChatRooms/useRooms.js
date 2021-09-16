import React, { useState, useReducer, useEffect, useContext, useRef, useCallback } from 'react';
import WebWorker from 'react-web-workers'
import { socket, useLocalStorage, RoomObject, MediaClient, mediaEvents } from '../../utils';
import { isPrivateRoom } from '../../apis';
import { UserContext, SettingContext } from '../../context';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { useHistory } from 'react-router-dom';
import { useAudio } from 'react-use';
import { permissionRequest } from './notification';
import config from '../../config';
import socketWorker from '../../utils/objects/socketWorker';

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
    const socketWorkerRef = useRef(null);
    const {messageTimeInterval, maxMessageLength} = useContext(SettingContext);
    const messageTimeRef = useRef(null);
    const [roomsState, roomsDispatch] = useReducer(roomsReducer, {
        status: 'idle',
        data: [],
        roomIndex: null,
        error: null,
    });
    const { myId, username, updateUserPoint, updateProfile, role, updateUser } = useContext(UserContext);
    const { enablePokeSound, enablePrivateSound, enablePublicSound, enableSysMessage,
        messageNum, showGift, showGiftMessage, autoBroadcast } = useContext(SettingContext);
    // current room state
    const [state, dispatch] = useReducer(roomReducer, {
        status: 'idle',
        data: null,
        error: null,
    });
    const [globalBlocks, setGlobalBlocks] = useState([]);
    const [globalCameraBans, setGlobalCameraBans] = useState([]);
    const [mutes, setMutes] = useLocalStorage('mutes', []);
    const privateListRef = useRef();
    const [roomEvent, setRoomEvent] = useState(null);
    const [socketEvent, setSocketEvent] = useState(null);
    const { t } = useTranslation();
    const { enqueueSnackbar } = useSnackbar();
    const [openDisconnectModal, setOpenDisconnectModal] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [openGiftModal, setOpenGiftModal] = useState(false);
    const [roomNameForPassword, setRoomNameForPassword] = useState('');
    const [giftUsername, setGiftUsername] = useState(null);
    const [gift, setGift] = useState(null);
    const [roomNameForGift, setRoomNameForGift] = useState(null);

    const roomNameRef = React.useRef(initRoomName);

    const [pokeAudio1, pokeAudioState1, pokeAudioControls1] = useAudio({
        src: '/media/poke_default.mp3',
        autoPlay: false ,
    });
    const [pokeAudio2, pokeAudioState2, pokeAudioControls2] = useAudio({
        src: '/media/poke_good_morning.mp3',
        autoPlay: false ,
    });
    const [pokeAudio3, pokeAudioState3, pokeAudioControls3] = useAudio({
        src: '/media/poke_where_are_you.mp3',
        autoPlay: false ,
    });
    const [pokeAudio4, pokeAudioState4, pokeAudioControls4] = useAudio({
        src: '/media/poke_nock.mp3',
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

    const changeRoom = useCallback(async (newRoomIndex) => {
        const data = {};
        let room = roomsRef.current[newRoomIndex];
        room.mergeUnreadMessages();
        data.name = room.name;
        data.messages = room.messages;
        data.users = room.onlineUsers;
        data.blocks = room.blocks;
        data.mutes = room.mutes
        data.unReadMessages = room.unReadMessages;
        data.users = room.users;
        data.cameraBans = room.cameraBans;
        data.localStream = await mediaClientRef.current.getLocalStream(room.name);
        data.remoteStreams = await mediaClientRef.current.getRemoteStreams(room.name);
        dispatch({type: 'init', data});
        roomNameRef.current = room.name;
        let newRoomsData = roomsRef.current.map(({name, unReadMessages}) => ({name, unReadMessages}));
        roomsDispatch({type: 'set', data: newRoomsData, roomIndex: newRoomIndex});
    }, [roomsRef]);

    const autoStartRemoteVideo = useCallback(async (room, producers, userId, locked, remoteUsername) => {
        // let result = await socket.request('check camera view', ({ room, targetUserId: userId }));
        let result = await socketWorkerRef.current?.request('check camera view', { room, targetUserId: userId })
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
        if (!result) {
            return false;
        }
        if (username !== remoteUsername && !locked && mediaClientRef.current) {
            await mediaClientRef.current.createRoom(room);
            await mediaClientRef.current.join(room);
            await mediaClientRef.current.initDevice(room);
            if (!mediaClientRef.current.checkConsumeState(room)) {
                await mediaClientRef.current.initTransports(room, false, true)
            }
            mediaClientRef.current.requestView(room, userId, remoteUsername, producers, false, null, null);
        }
    }, [mediaClientRef, username]);

    const initRoom = useCallback(async ({room, globalBlocks, onlineUsers, messages, blocks, cameraBans, globalCameraBans}) => {
        let data = {};
        if(roomsRef.current && room) {
            if (Array.isArray(globalBlocks)) {
                setGlobalBlocks(globalBlocks);
            }
            if (Array.isArray(globalCameraBans)) {
                setGlobalCameraBans(globalCameraBans);
            } 
            let sameRoom = roomsRef.current.find((item) => (item.name === room.name));
            if (!sameRoom) {
                let newMessages = null;
                if(room.welcomeMessage) {
                    let wcMsg = {
                        type: 'system',
                        msg: room.welcomeMessage
                    };
                    newMessages = [wcMsg, ...messages];
                }
                
                let newRoomObject = new RoomObject(room.name, newMessages? newMessages: messages, onlineUsers, blocks, cameraBans, messageNum);
                roomsRef.current.push(newRoomObject);
                data.name = room.name;
                data.messages = newRoomObject.messages;
                data.users = onlineUsers;
                data.blocks = blocks;
                data.mutes = newRoomObject.mutes
                data.unReadMessages = newRoomObject.unReadMessages;
                data.localStream = null;
                data.remoteStreams = null;
                data.cameraBans = newRoomObject.cameraBans;
                dispatch({type: 'init', data});
                roomNameRef.current = room.name;
                roomsDispatch({type: 'add', data: {
                        name: room.name,
                        unReadMessages: newRoomObject.unReadMessages
                    }
                });
                if (autoBroadcast) {
                    onlineUsers.forEach(({ _id, username, video }) => {
                        if (video) {
                            const { producers, locked, room } = video;
                            autoStartRemoteVideo(room, producers, _id, locked, username);
                        }
                    })
                }
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
                data.name = sameRoom.name;
                data.messages = sameRoom.messages;
                data.users = sameRoom.users;
                data.blocks = sameRoom.blocks;
                data.mutes = sameRoom.mutes
                data.unReadMessages = sameRoom.unReadMessages;
                data.localStream = null;
                data.remoteStreams = null;
                data.cameraBans = sameRoom.cameraBans;
                dispatch({type: 'init', data});
            }

        }
    }, [roomsRef, dispatch, roomsDispatch, messageNum, autoBroadcast, autoStartRemoteVideo]);

    const addRoom = useCallback(async (room, callback) => {
        let roomNames = await roomsRef.current.map((oneRoom) => (oneRoom.name));
        if(room && roomNames && !roomNames.includes(room)) {
            isPrivateRoom(room, ({isPrivate}) => {
                if(isPrivate) {
                    callback(false, 'password');
                } else {
                    if (socketWorkerRef.current) {
                        // socketWorkerRef.current.postMessage({
                        //     mName: 'join room',
                        //     mValue: { room }
                        // })
                        socketWorkerRef.current.request('join room', { room })
                        .then((result) => {
                            if (result) {
                                enqueueSnackbar(t(`ChatApp.${result}`, { roomName: room}), {variant: 'error'})
                            }
                        })
                        .catch((error) => {
                            enqueueSnackbar(error, {variant: 'error'})
                        })
                    }
                    // socket.emit('join room', { room }, (result, message) => {
                    //     if(result) {
                    //         if (message) {
                    //             enqueueSnackbar(t(`ChatApp.${message}`, { roomName: room}), {variant: 'error'})
                    //         }
                    //     } else {
                    //         enqueueSnackbar(message, {variant: 'error'})
                    //     }
                    // });
                }
            }, (err) => {
                // console.log(err);
            })
            // socket.emit('join room', { room });
            callback(true);
        } else {
            callback(false, 'already_entered');
        }
    }, [roomsRef])

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
    }, [enableSysMessage, username, dispatch]);

    const removeUser = useCallback(async ({room, leavedUser}) => {
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
                    });
                    if (mediaClientRef.current) {
                        mediaClientRef.current.deleteViewer(room, leavedUserInfo.username);
                        mediaClientRef.current.removeRemoteStream(leavedUserInfo.username, null, room);
                    }
                } else {
                    //you leaved from room by server
                }
            }
        }
    }, [enableSysMessage, dispatch, roomsRef, mediaClientRef]);

    const kickedUser = useCallback(async ({room, kickedUserName, type, role, username: adminName, reason}) => {
        if(roomsRef.current && room) {
            let sameRoom = roomsRef.current.find((item) => (item.name === room));
            if(sameRoom) {
                let kickedUser = sameRoom.users.find(({username}) => (username === kickedUserName));
                if(username !== kickedUserName) { // kick other
                    if(kickedUser) {
                        sameRoom.removeOnlineUser(kickedUser._id);
                        let msg= null;
                        if (type === 'kick') {
                            msg = t('ChatApp.sys_kick',{
                                username: kickedUserName,
                                roomName: room,
                                userRole: t(`ChatApp.${role}`),
                                adminName
                            })
                        } else if (type = 'ban') {
                            if (reason && reason !== '') {
                                msg = t('ChatApp.sys_ban_with_reason',{
                                    username: kickedUserName,
                                    roomName: room,
                                    userRole: t(`ChatApp.${role}`),
                                    adminName,
                                    reason
                                });
                            } else {
                                msg = t('ChatApp.sys_ban',{
                                    username: kickedUserName,
                                    roomName: room,
                                    userRole: t(`ChatApp.${role}`),
                                    adminName,
                                });
                            }
                        } else {
                            return;
                        }
                        const message = {
                            _id: makeid(10),
                            type: 'joinLeave',
                            msg
                        }
                        sameRoom.addMessages([message]);
                        const newData = {
                            name: room,
                            messages: sameRoom.messages,
                            users: sameRoom.users
                        };
                        
                        dispatch({type: 'update',
                            data: newData
                        })
                    }
                    
                } else { // kick you
                    setRoomEvent({type: 'remove room', data: {room, reason: type, role, adminName, banReason: reason}});
                }
                
            }
        } else if(roomsRef.current.length && type === 'global ban') {
            if(username !== kickedUserName) {
                roomsRef.current.forEach((roomRef) => {
                 // kick other
                    let kickedUser = roomRef.users.find(({username}) => (username === kickedUserName));
                    if(kickedUser) {
                        roomRef.removeOnlineUser(kickedUser._id);
                        let msg = null;
                        if (reason && reason !== '') {
                            msg = t('ChatApp.sys_ban_with_reason',{
                                username: kickedUserName,
                                roomName: t('ChatApp.all_rooms'),
                                userRole: t(`ChatApp.admin`),
                                adminName,
                                reason
                            });
                        } else {
                            msg = t('ChatApp.sys_ban',{
                                username: kickedUserName,
                                roomName: t('ChatApp.all_rooms'),
                                userRole: t(`ChatApp.admin`),
                                adminName
                            });
                        }
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
                let alertText = null;
                if (reason && reason !== '') {
                    alertText = t('ChatApp.error_ban_with_reason', {
                        roomName: t(`ChatApp.all_rooms`),
                        userRole: t(`ChatApp.admin`),
                        adminName,
                        reason
                    });
                } else {
                    alertText = t('ChatApp.error_ban', {
                        roomName: t(`ChatApp.all_rooms`),
                        userRole: t(`ChatApp.admin`),
                        adminName
                    });
                }
                enqueueSnackbar(alertText, {variant: 'error'});
            }
        }
    }, [username, dispatch, roomsRef])

    const updateBlocks = useCallback(async ({room, blocks}) => {
        if(roomsRef.current && room) {
            let sameRoom = roomsRef.current.find((item) => (item.name === room));
            if(sameRoom && Array.isArray(blocks)) {
                sameRoom.updateBlocks(blocks);
                dispatch({type: 'update', data: { name: room, blocks}});
            }
        }
    }, [dispatch, roomsRef]);

    const updateCameraBans = useCallback(({room, cameraBans}) => {
        if(roomsRef.current && room) {
            let sameRoom = roomsRef.current.find((item) => (item.name === room));
            if (!sameRoom) return;
            if(sameRoom && Array.isArray(cameraBans)) {
                sameRoom.updateCameraBans(cameraBans);
                dispatch({type: 'update', data: { name: room, cameraBans}});
            }
            const myUserData = sameRoom.getUserData(username);
            let isCameraBanned = false;
            for (const { username, ip, fromIp, toIp } of cameraBans) {
                if (username === myUserData.username || myUserData.ip === ip) {
                    isCameraBanned = true;
                    break;
                }
                if (myUserData.ip > fromIp && myUserData.ip < toIp) {
                    isCameraBanned = true;
                    break;
                }
            }
            if (isCameraBanned && mediaClientRef.current) {
                mediaClientRef.current.exitRoom(room);
            }
        }
    }, [dispatch, username, roomsRef]);

    const removeRoom = useCallback(async (room, callback) => {
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
                    data.localStream = await mediaClientRef.current.getLocalStream(newRoom.name);
                    data.remoteStreams = await mediaClientRef.current.getRemoteStreams(newRoom.name);
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
    }, [status, roomsStatus, roomIndex, data, dispatch, roomsDispatch, roomsRef, roomNameRef])

    const changeMuteState = useCallback(async (roomName, userToMute, isMuted) => {
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
    }, [data, mutes, roomsRef, dispatch, setMutes])

    const receiveMessage = useCallback(async (message, callback) => {
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
    }, [dispatch, roomsDispatch, roomsRef]);

    const receivePoke = useCallback(async (pokeMessage, callback) => {
        
        let {room} = pokeMessage;
        if(roomsRef.current && room) {
            let sameRoom = roomsRef.current.find((item) => (item.name === room));
            if(sameRoom) {
                if(pokeMessage.to === username) {
                    let message = {
                        _id: makeid(10),
                        type: 'poke',
                        from: pokeMessage.from,
                        msg: t(`PokeMessage.poke_${pokeMessage.pokeType}`, {
                            sender: pokeMessage.from,
                            receiver: t('PokeMessage.you')
                        }),
                    }
                    sameRoom.addMessages([message]);
                    let userToReceive = sameRoom.users.find((item) => (item.username === pokeMessage.from));
                    if(userToReceive && !sameRoom.checkMuteByName(pokeMessage.from)) {
                        switch(pokeMessage.pokeType) {
                            case 'default':
                                pokeAudioControls1.seek(0);
                                pokeAudioControls1.play();
                                break;
                            case 'good_morning':
                                pokeAudioControls2.seek(0);
                                pokeAudioControls2.play();
                                break;
                            case 'where_are_you':
                                pokeAudioControls3.seek(0);
                                pokeAudioControls3.play();
                                break;
                            case 'nock':
                                pokeAudioControls4.seek(0);
                                pokeAudioControls4.play();
                                break;
                            default:
                                break;
                        }
                        if (callback) {
                            callback(true)
                        }
                    } else {
                        if (callback) callback(false)
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
    }, [username, roomsRef, dispatch]);

    const addMessage = useCallback(async ({message, room}) => {
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
    }, [roomsRef, dispatch])

    const sendMessage = useCallback(async (roomName, to, color, msg, bold, type, messageType) => {
        if (msg) {
            const date = Date.now()
            let offset = 2000
            if (messageTimeRef.current) {
                offset = date - messageTimeRef.current
                if (offset < messageTimeInterval) {
                    enqueueSnackbar(t('Message.timeError'), {variant: 'error'});
                    return
                }
            }
            messageTimeRef.current = date
            if (msg?.length > maxMessageLength) {
                enqueueSnackbar(t('Message.error_long_message'), {variant: 'error'})
                return
            }
            if(type === 'private') {
                privateListRef.current.addMessage({
                    _id: makeid(5),
                    type, roomName, msg, from: username, to, color, bold, messageType, date
                }, roomName);
                socketWorkerRef.current.request('private message', { type, roomName, msg, from: username, to, color, bold, messageType })
                .catch((err) => {
                    if(err === 'logout') {
                        privateListRef.current.addErrorMessage(roomName);
                    } else if (err === 'forbidden') {
                        enqueueSnackbar(t('Message.forbidden'), {variant: 'error'});
                    } else if (err === 'muted') {
                        enqueueSnackbar(t('Message.private_muted'), {variant: 'error'});
                    } else if (err === 'blocked') {
                        enqueueSnackbar(t('Message.private_blocked'), {variant: 'error'});
                    }
                })
            } else {
                socketWorkerRef.current.emit('public message', {
                    type, msg, room: roomName, from: username, color, bold, messageType
                })
                addMessage({message: { _id: makeid(5), type, msg, room: roomName, from: username, color, bold, messageType, date }, room: roomName})
            }
        }
    }, [socketWorkerRef, privateListRef, messageTimeRef, maxMessageLength, username]);

    // send poke message
    const sendPokeMessage = useCallback(async (roomName, userToSend, pokeType) => {
        if (socketWorkerRef.current) {
            // socketWorkerRef.current.postMessage({
            //     mName: 'poke message',
            //     mValue: { from: username, to: userToSend, room: roomName, pokeType }
            // }
            socketWorkerRef.current.request('poke message', { from: username, to: userToSend, room: roomName, pokeType })
            .then((response) => {
                // this is callback function that can excute on server side
                if (response === 'success'){
                    addMessage({
                        room: roomName,
                        message: {
                            type: 'poke',
                            msg: t(`PokeMessage.poke_${pokeType}`, {
                                sender: t('PokeMessage.you'),
                                receiver: userToSend
                            }),
                        }
                    })
                }
            })
            .catch((error) => {
                if(error === 'muted') {
                    enqueueSnackbar(t('PokeMessage.error_muted'), {variant: 'error'});
                }
            })
        }
    }, [socketWorkerRef, username, addMessage])

    const kickUser = useCallback(async (roomName, usernameToKick) => {
        if (socketWorkerRef.current) {
            // socketWorkerRef.current.postMessage({
            //     mName: 'kick user',
            //     mValue: { room: roomName, to: usernameToKick }
            // });
            socketWorkerRef.current.emit('kick user', { room: roomName, to: usernameToKick });
        }
    }, [socketWorkerRef])
    const banUser = useCallback(async (payload) => {
        if (socketWorkerRef.current) {
            socketWorkerRef.current.emit('ban user', payload)
        }
    }, [socketWorkerRef])

    const blockUser = useCallback((roomName, username) => {
        if (socketWorkerRef.current) {
            socketWorkerRef.current.emit('block user', { room: roomName, username })
        }
    }, [socketWorkerRef]);
    const unBlockUser = useCallback((roomName, username) => {
        if (socketWorkerRef.current) {
            socketWorkerRef.current.emit('unblock user', { room: roomName, username })
        }
    }, [socketWorkerRef]);
    const unbanCamera = useCallback((roomName, username) => {
        if (socketWorkerRef.current) {
            socketWorkerRef.current.emit('unban camera', { room: roomName, username })
        }
    }, [socketWorkerRef]);

    const stopBroadcastTo = useCallback(async (roomName, userId, name) => {
        if(mediaClientRef.current) {
            mediaClientRef.current.stopView(roomName, userId, name);
        }
    }, [socketWorkerRef])

    const updatePoints = useCallback(async (usersWithPoints) => {
        const userToUpdate = usersWithPoints.find(({ username: usernameToUpdate }) => (username === usernameToUpdate));
        if (userToUpdate) {
            updateUserPoint(userToUpdate.point)
        }
        roomsRef.current.map((room) => {
            if (room.updateUserPoints(usersWithPoints)) {
                if (roomNameRef.current === room.name) {
                    dispatch({
                        type: 'update',
                        data: {
                            name: room.name,
                            users: room.users
                        }
                    })
                }
            }
        })
    }, [roomsRef, updateUserPoint, dispatch, username]);

    const updateUserProfile = useCallback(async (userInfo) => {
        if (userInfo.username === username) {
            updateProfile(userInfo)
        }
        roomsRef.current.map((room) => {
            if (room.updateUserInfo(userInfo)) {
                if (roomNameRef.current === room.name) {
                    dispatch({
                        type: 'update',
                        data: {
                            name: room.name,
                            users: room.users
                        }
                    })
                }
            }
        })
    }, [roomsRef, roomNameRef, dispatch, username]);

    const sendGift = useCallback((gift, amount) => {
        if (socketWorkerRef.current && gift && amount > 0) {
            socketWorkerRef.current.request('send gift', {
                to: giftUsername,
                giftId: gift._id,
                room: roomNameForGift,
                amount
            })
            .then(() => {
                updateUser()
            })
            .catch((error) => {
                console.log(error)
            })
        }
    }, [updateUser, socketWorkerRef, roomNameForGift, giftUsername]);

    const receiveGift = useCallback(async (payload) => {
        try {
            const { gift, from, to, room, amount } = payload;
            if (gift && from && to && room) {
                const isForMe = to === username;
                if (showGift && isForMe) {
                    setGift(payload.gift);
                    // updateUser()
                }
                if (showGiftMessage) {
                    const message = {
                        _id: makeid(10),
                        type: 'gift',
                        from,
                        to,
                        msg: t(isForMe? 'ChatApp.gift_send_to_you': 'ChatApp.gift_send', {
                            sender: from,
                            receiver: to,
                            amount,
                            giftName: gift.name
                        }),
                        giftImage: config.gift_path + gift.imageSrc
                    }
                    addMessage({ message, room });
                    if (isForMe && roomNameRef.current !== room) {
                        addMessage({ message, room: roomNameRef.current})
                    }
                }
            }
        } catch (err) {
            // console.log(err)
        }
    }, [addMessage, showGift, showGiftMessage, username]);

    const startBroadcast = useCallback(async (room, lock, videoDeviceId, audioDeviceId) => {
        try {
            // let result = await socket?.request('check camera broadcast', ({ room }));
            let result = await socketWorkerRef.current?.request('check camera broadcast', { room })
            .then(() => {
                return true;
            })
            .catch(() => {
                return false;
            });

            if (!result) {
                enqueueSnackbar(t('ChatApp.error_camera_banned'), { variant: 'error'});
                return false;
            }
            if (mediaClientRef.current) {
                let result = await mediaClientRef.current.startStream(room, null, null);
                if (result !== true) {
                    enqueueSnackbar(t('UserActionArea.error_already_broadcasting', {
                        roomName: result
                    }), { variant: 'error'});
                    return false;
                }
                await mediaClientRef.current.createRoom(room);
                await mediaClientRef.current.join(room);
                await mediaClientRef.current.initDevice(room);
                if (!mediaClientRef.current.checkProduceState(room)) {
                    await mediaClientRef.current.initTransports(room, true, false)
                }
                if(mediaClientRef.current.rooms.has(room)) {
                    let result = await mediaClientRef.current.produce(room, lock, videoDeviceId, audioDeviceId);
                    if (result) {
                        const { producers, locked } = result;
                        if (socketWorkerRef.current) {
                            socketWorkerRef.current.emit('start video', {
                                room,
                                producers,
                                locked
                            })
                        }
                    }
                } else {
                    enqueueSnackbar(t('UserActionArea.error_not_ready_broadcast'), {variant: 'error'});
                    mediaClientRef.current.stopStream(room);
                }
            }
        } catch (err) {
            enqueueSnackbar(t('UserActionArea.error_not_ready_broadcast'), {variant: 'error'});
            mediaClientRef.current.stopStream(room);
        }
        
    }, [mediaClientRef, socketWorkerRef]);

    const stopBroadcast = useCallback(async (roomName) => {
        if(mediaClientRef.current) {
            mediaClientRef.current.closeProducer(null, roomName);
        }
        socketWorkerRef.current.emit('stop video', {
            room: roomName
        })
    }, [mediaClientRef, socketWorkerRef]);

    const viewBroadcast = useCallback(async (roomName, userId, targetUsername, producers, locked) => {
        // let result = await socket.request('check camera view', ({ room: roomName, targetUserId: userId }));
        let result = await socketWorkerRef.current?.request('check camera view', { room: roomName, targetUserId: userId })
        .then(() => {
            return true;
        })
        .catch(() => {
            return false;
        });
        if (!result) {
            enqueueSnackbar(t('ChatApp.error_camera_view_banned'), { variant: 'error'});
            return false;
        }
        if (mediaClientRef.current && targetUsername !== username) {
            
            await mediaClientRef.current.createRoom(roomName);
            await mediaClientRef.current.join(roomName);
            await mediaClientRef.current.initDevice(roomName);
            if (!mediaClientRef.current.checkConsumeState(roomName)) {
                await mediaClientRef.current.initTransports(roomName, false, true)
            }
            mediaClientRef.current.requestView(roomName, userId, targetUsername, producers, locked,
            (result) => {
                if (result) {
                    enqueueSnackbar(t('ChatApp.pending_permission_request', { username: targetUsername }), {variant: 'info'});
                } else {
                    enqueueSnackbar(t('UserActionArea.you_are_already_watching_the_broadcasting', { username: targetUsername }), {variant: 'info'});
                }
            },
            (result) => {
                if(result) {
                    enqueueSnackbar(t('ChatApp.owner_permission_granted', { username: targetUsername }), {variant: 'info'});
                } else {
                    enqueueSnackbar(t('ChatApp.owner_permission_denied', { username: targetUsername }), {variant: 'info'});
                }
            });
        }
    }, [mediaClientRef, username]);

    const controlVideo = useCallback(async (data) => {
        let { type, name, roomName, kind } = data;
        if(mediaClientRef.current) {
            switch(type) {
                case 'close':
                    if(name === username) {
                        mediaClientRef.current.closeProducer(null, roomName);
                        socketWorkerRef.current.emit('stop video', {
                            room: roomName
                        })
                    } else {
                        mediaClientRef.current.removeRemoteStream(name, null, roomName);
                    }
                    break;
                case 'pause':
                    if (name === username) {
                        mediaClientRef.current.pauseProducer(roomName, kind);
                    }
                    break;
                case 'resume':
                    if (name === username) {
                        mediaClientRef.current.resumeProducer(roomName, kind);
                    }
                    break;
                default:
                    break;
            }
        }
    }, [mediaClientRef, username, socketWorkerRef]);

    const leaveFromPrivate = async (roomName) => {
        socketWorkerRef.current.postMessage({
            mName: 'leave private',
            mValue: roomName
        });
    }

    const addOrOpenPrivate = useCallback((to) => {
        if(to && !privateListRef.current.openChat(to)) {
            if (socketWorkerRef.current) {
                socketWorkerRef.current.request('open private', { from: username, to: to.username, role })
                .then((roomName) => {
                    if(roomName) {
                        privateListRef.current.addChat(to, roomName);
                    }
                })
                .catch((error) => {
                    if(error === 'private_error_guest') {
                        enqueueSnackbar(t('UserActionArea.error_guest_dont_have_permission'), {variant: 'error'});
                    }
                })
            }
            // .postMessage({
            //     mName: 'open private',
            //     mValue: { from: username, to, role }
            // });if(roomName) {
            //     privateListRef.current.addChat(to, roomName);
            // } else {
            //     if(err === 'private_error_guest') {
            //         enqueueSnackbar(t('UserActionArea.error_guest_dont_have_permission'), {variant: 'error'});
            //     }
            // }
        }
    }, [privateListRef, socketWorkerRef, enqueueSnackbar]);

    const startRemoteVideo = useCallback(async (room, producers, userId, locked, remoteUsername) => {
        try {
            const roomObj = roomsRef.current.find((item) => (item.name === room));
            if (roomObj && roomObj.updateUserVideo(userId, producers, locked)) {
                if (roomNameRef.current === room) {
                    dispatch({
                        type: 'update',
                        data: {
                            name: room,
                            users: roomObj.users
                        }
                    })
                }
                if (autoBroadcast) {
                    autoStartRemoteVideo(room, producers, userId, locked, remoteUsername);
                }
            }
        } catch (err) {
            // console.log(err);
        }
    }, [roomsRef, dispatch, autoBroadcast, autoStartRemoteVideo]);

    const stopRemoteVideo = useCallback(async (room, userId) => {
        const roomObj = roomsRef.current.find((item) => (item.name === room));
        if (!roomObj) return;
        const user = roomObj.updateUserVideo(userId, null, null);
        if (user) {
            if (roomNameRef.current === room) {
                dispatch({
                    type: 'update',
                    data: {
                        name: room,
                        users: roomObj.users
                    }
                })
            }
            if (mediaClientRef.current) {
                mediaClientRef.current.removeRemoteStream(user.username, null, room);
            }
        }
    }, [roomsRef, roomNameRef, dispatch, mediaClientRef]);

    const receiveSocketMessage = useCallback((event) => {
        const { type, mName, mData } = event.data;
        let callback = null;
        if (type === 'emit') {

        } else if (type === 'request') {
            callback = (result, error) => {
                if (!result) {
                    event.ports[0].postMessage({error});
                } else {
                    event.ports[0].postMessage({result});
                }
            }
        }
        switch (mName) {
            case 'init room':
                const {
                    room, onlineUsers, messages, blocks, globalBlocks, cameraBans,
                    globalCameraBans
                } = mData
                let usernames = onlineUsers.map((item) => (item.username));
                if(usernames.includes(username)) {
                    initRoom({room, onlineUsers, messages, blocks, globalBlocks, cameraBans, globalCameraBans});
                }
                break;
            case 'room message':
                receiveMessage(mData);
                break;
            case 'disconnect':
                const { reason } = mData;
                setOpenDisconnectModal(true);
                if (mediaClientRef.current) {
                    mediaClientRef.current.exit(true);
                }
                if (reason === 'io server disconnect') {
                    // the disconnection was initiated by the server, you need to reconnect manually
                    socketWorkerRef.current.emit('connect');
                }
                break;
            case 'joined room':
                addUser(mData);
                break;
            case 'leave room':
                removeUser(mData);
                break;
            case 'kicked user':
                kickedUser({ ...mData, type: 'kick' });
                break;
            case 'banned user':
                kickedUser({ ...mData, type: 'ban' });
                break;
            case 'global banned user':
                kickedUser({ ...mData, type: 'global ban' });
                break
            case 'reconnect':
                let roomNames = roomsRef.current?.map((room) => (room.name));
                let privateRooms = privateListRef.current ? privateListRef.current.getPrivateRooms(): [];
                roomNames.map(async (roomName) => {
                    socketWorkerRef.current.request('rejoin room', { room: roomName, type: 'public' })
                    .catch((error) => {
                        removeRoom(roomName)
                    })
                    // socketWorkerRef.current.postMessage({
                    //     mName: 'rejoin room',
                    //     mValue: { room: roomName, type: 'public' }
                    // });
                });
                privateRooms.forEach((roomName) => {
                    socketWorkerRef.current.request('rejoin room', { room: roomName, type: 'private' })
                })
                setOpenDisconnectModal(false)
                break;
            case 'update block':
                const { room: roomToBlock, blocks: newBlocks }= mData;
                updateBlocks({ room: roomToBlock, blocks: newBlocks });
                break;
            case 'update global block':
                const { blocks: newGlobalBlocks } = mData;
                setGlobalBlocks(newGlobalBlocks);
                break;
            case 'update camera bans':
                updateCameraBans(mData);
                break;
            case 'update global camera bans':
                const { globalCameraBans: newGlobalCameraBans } = mData;
                if (Array.isArray(newGlobalCameraBans))
                    setGlobalCameraBans(newGlobalCameraBans);
                break;
            case 'poke message':
                receivePoke(mData, callback);
                break;
            case 'update points':
                updatePoints(mData)
                break;
            case 'update user info':
                updateUserProfile(mData)
                break;
            case 'received gift':
                receiveGift(mData);
                break;
            case 'start video':
                const {
                    room: startVideoRoom,
                    producers,
                    userId: startVideoUserId,
                    username: startVideoUsername,
                    locked: startVideoLocked
                } = mData;
                startRemoteVideo(startVideoRoom, producers, startVideoUserId, startVideoLocked, startVideoUsername);
                break;
            case 'stop video':
                const { room: roomToStopVideo, userId } = mData;
                stopRemoteVideo(roomToStopVideo, userId);
                break;
            case 'view request':
                const { username: viewRequestName, roomName: viewRequestRoom } = mData;
                requestAudioControls.seek(0);
                requestAudioControls.play();
                permissionRequest(viewRequestName, viewRequestRoom, (result) => {
                    if (callback) callback(result);
                });
                break;
            case 'start view':
                const { room_id: startViewRoom, name: startViewName } = mData;

                if (mediaClientRef.current) {
                    mediaClientRef.current.addViewer(startViewRoom, startViewName);
                }
                break;
            case 'stop view':
                const { name: stopViewName, room_id: stopViewRoom } = mData;
                if (mediaClientRef.current) {
                    mediaClientRef.current.deleteViewer(stopViewRoom, stopViewName);
                }
                break;
            case 'stop view from':
                const { name: stopViewFromName, room_id: stopViewFromRoom } = mData;
                if (mediaClientRef.current) {
                    mediaClientRef.current.removeRemoteStream(stopViewFromName, null, stopViewFromRoom);
                    mediaClientRef.current.removeConsumers(stopViewFromRoom, stopViewFromName);
                }
                break;
            case 'private_error_logout':
                const { roomName: logoutRoomName } = mData;
                privateListRef.current.addErrorMessage(logoutRoomName);
                break;
            case 'private_error_forbbiden':
                enqueueSnackbar(t('Message.forbidden'), {variant: 'error'});
                break;
            case 'private_error_muted':
                enqueueSnackbar(t('Message.private_muted'), {variant: 'error'});
                break;
            case 'private_error_blocked':
                enqueueSnackbar(t('Message.private_blocked'), {variant: 'error'});
                break
            case 'repeat connection':
                enqueueSnackbar(t('ChatApp.already_in_chat'), {variant: 'error'});
                history.push('/');
                break;
            default:
                break;
        }



    }, [initRoom, receiveMessage, setOpenDisconnectModal, addUser,
        kickUser, removeUser, receivePoke, enqueueSnackbar, updateBlocks,
        setGlobalBlocks, updateCameraBans, setGlobalCameraBans,
        updatePoints, stopRemoteVideo,
        updateUserProfile,
        receiveGift, mediaClientRef
    ])

    useEffect(() => {
        const [workerObj] = WebWorker([socketWorker]);
        socketWorkerRef.current = workerObj;
        
        workerObj.request = (mName, mValue) => {
            return new Promise((resolve, reject) => {
                const channel = new MessageChannel(); 

                channel.port1.onmessage = ({data}) => {
                    channel.port1.close();
                    if (data.error) {
                        reject(data.error);
                    }else {
                        resolve(data.result);
                    }
                };

                workerObj.postMessage({
                    type: 'request',
                    mName,
                    mValue
                }, [channel.port2]);
            })
        }
        workerObj.emit = (mName, mValue) => {
            workerObj.postMessage({
                type: 'emit',
                mName,
                mValue
            });
        }
        const token = window.localStorage.getItem('token');
        workerObj.postMessage({ type: 'init', mValue: { token } });

        return () => {
            workerObj.postMessage({ type: 'close' });
        }
    }, [])

    useEffect(() => {
        if (socketWorkerRef.current) {
            socketWorkerRef.current.onmessage = receiveSocketMessage;
        }
    }, [receiveSocketMessage])

    useEffect(() => {
        if (username && roomsRef.current && roomsRef.current.length && globalCameraBans && globalCameraBans.length) {
            const room = roomsRef.current[0];
            if (!room) return;
            const myUserData = room.getUserData(username);
            let isCameraBanned = false;
            for (const { username, ip, fromIp, toIp } of globalCameraBans) {
                if (username === myUserData.username || myUserData.ip === ip) {
                    isCameraBanned = true;
                    break;
                }
                if (myUserData.ip > fromIp && myUserData.ip < toIp) {
                    isCameraBanned = true;
                    break;
                }
            }
            if (isCameraBanned && mediaClientRef.current) {
                mediaClientRef.current.exit(true);
            }
        }
    }, [roomsRef, username, globalCameraBans, mediaClientRef])


    useEffect(() => {
        if(initRoomName && username) {
            // socket.on('stop video', async ({ room, userId }) => {
            //     stopRemoteVideo(room, userId)
            // })
            // socket.on('check camera state', ({ room, userId }, callback) => {
            //     checkCameraState(room, userId, callback);
            // })
            // socket.on('view request', async ({ username, roomName }, callback) => {
            //     requestAudioControls.seek(0);
            //     requestAudioControls.play();
            //     permissionRequest(username, roomName, (result) => {
            //         callback(result);
            //     });
            // })
            isPrivateRoom(initRoomName, ({isPrivate}) => {
                if(isPrivate) {
                    setRoomNameForPassword(initRoomName);
                    setOpenPasswordModal(true);
                } else {
                    if (socketWorkerRef.current) {
                        socketWorkerRef.current.request('join room', { room: initRoomName })
                        .then((result) => {
                            if (result) {
                                enqueueSnackbar(t('ChatApp.'+result, {roomName: initRoomName}), {variant: 'info'});
                            }
                        })
                        .catch((error) => {
                            if(error)
                                enqueueSnackbar(t('ChatApp.'+error, {roomName: initRoomName}), {variant: 'error'});
                            dispatch({type: 'rejected', error: 'join error'});
                        })
                        // socketWorkerRef.current.postMessage({ mName: 'join', mValue: { room: initRoomName }});
                            // JSONfn.stringify({
                            //     joinFunction: (result) => {
                            //         console.log('ok', result)
                            //         return true
                            //     },
                            //     enqueueSnackbar
                            // })
                    }
                    // socket.emit('join room', { room: initRoomName }, (result, message) => {
                    //     if(!result) {
                    //         if(message)
                    //             enqueueSnackbar(t('ChatApp.'+message, {roomName: initRoomName}), {variant: 'error'});
                    //         dispatch({type: 'rejected', error: 'joine error'});
                    //     } else {
                    //         if (message) {
                    //             enqueueSnackbar(t('ChatApp.'+message, {roomName: initRoomName}), {variant: 'info'});
                    //         }
                    //     }
                    // });
                }
            }, (err) => {
                console.log(err.message);
            })
        }
        // return () => {
        //     // socket.removeAllListeners();
        //     // socket.io.removeAllListeners();
        //     socket.close();
        //     socket.off('init room');
        //     socket.off('update block');
        //     socket.off('update global block');
        //     socket.off('room message');
        //     socket.off('private message');
        //     socket.off('poke message');
        //     socket.off('disconnect');
        //     socket.off('repeat connection');
        //     socket.io.off('reconnect');
        //     socket.off('view request');
        // };
    }, [initRoomName, username]);

    // useEffect(() => {
    //     socket.on('init room', async ({room, onlineUsers, messages, blocks, globalBlocks, cameraBans, globalCameraBans}, fn) => {
    //         fn('success');
    //         let usernames = await onlineUsers.map((item) => (item.username));
    //         if(usernames.includes(username)) {
    //             initRoom({room, onlineUsers, messages, blocks, globalBlocks, cameraBans, globalCameraBans});
    //         }
    //     });
    //     return () => {
    //         socket.off('init room');
    //     };
    // }, [username, autoBroadcast])

    // useEffect(() => {
    //     socket.on('start view', ({ room_id, name}) => {
    //         if (mediaClientRef.current) {
    //             mediaClientRef.current.addViewer(room_id, name);
    //         }
    //     });

    //     socket.on('stop view', async (data) => {
    //         let {name, room_id} = data;
    //         if (mediaClientRef.current) {
    //             mediaClientRef.current.deleteViewer(room_id, name);
    //         }
    //     })

    //     socket.on('stop view from', async (data) => {
    //         let {name, room_id} = data;
    //         if (mediaClientRef.current) {
    //             mediaClientRef.current.removeRemoteStream(name, null, room_id);
    //             mediaClientRef.current.removeConsumers(room_id, name);
    //         }
    //     })

    //     return () => {
    //         socket.off('start view');
    //         socket.off('stop view');
    //     }
    // }, [username, mediaClientRef])

    // useEffect(() => {
    //     // socket.on('joined room',async ({room, onlineUsers, joinedUser}) => {
    //     //     addUser({room, onlineUsers, joinedUser});
    //     // });
    //     // socket.on('leave room', async ({room, onlineUsers, leavedUser}) => {
    //     //     removeUser({room, leavedUser});
    //     // });
    //     // socket.on('kicked user', async ({room, kickedUserName, role, username, reason}) => {
    //     //     kickUser({room, kickedUserName, type: 'kick', role, username, reason});
    //     // });
    //     // socket.on('banned user', async ({room, kickedUserName, role, username, reason}) => {
    //     //     kickUser({room, kickedUserName, type: 'ban', role, username, reason});
    //     // });
    //     // socket.on('global banned user', async ({kickedUserName, role, username, reason}) => {
    //     //     kickUser({kickedUserName, type: 'global ban', role, username, reason});
    //     // });

    //     return () => {
    //         socket.off('joined room');
    //         socket.off('leave room');
    //         socket.off('banned user');
    //         socket.off('global banned user');
    //     }
    // }, [addUser, removeUser, kickedUser])

    // useEffect(() => {
    //     socket.on('received gift', (payload) => {
    //         receiveGift(payload);
    //     })

    //     return () => {
    //         socket.off('received gift');
    //     }
    // }, [receiveGift])

    // useEffect(() => {
    //     socket.on('start video', ({ room, producers, userId, username, locked }) => {
    //         startRemoteVideo(room, producers, userId, locked, username);
    //     })

    //     return () => {
    //         socket.off('start video');
    //     }
    // }, [startRemoteVideo])

    useEffect(() => {
        let mediaObj = null;
        if (username && myId && socketWorkerRef.current) {
            mediaObj = new MediaClient(username, myId, socketWorkerRef.current);
            mediaObj.on(mediaEvents.onChangeRemoteStreams, async (data) => {
                const {room_id} = data;
                if (room_id) {
                    const remoteStreams = await mediaClientRef.current.getRemoteStreams(room_id);
                    dispatch({
                        type: 'update',
                        data: {
                            name: room_id,
                            remoteStreams
                        }
                    })
                } else {
                    const remoteStreams = await mediaClientRef.current.getRemoteStreams(roomNameRef.current);
                    dispatch({
                        type: 'update',
                        data: {
                            name: roomNameRef.current,
                            remoteStreams
                        }
                    })
                }
            })

            mediaObj.on(mediaEvents.startStream, async (data) => {
                try {
                    const {room_id} = data;
                    const stream = await mediaObj.getLocalStream(room_id);
                    dispatch({
                        type: 'update',
                        data: {
                            name: room_id,
                            localStream: { ...stream }
                        }
                    })
                } catch (err) {
                    console.log(err.message);
                }
            })

            mediaObj.on(mediaEvents.stopStream, async (data) => {
                let {room_id} = data;
                if (room_id) {
                    dispatch({
                        type: 'update',
                        data: {
                            name: room_id,
                            localStream: null
                        }
                    });
                    socketWorkerRef.current.emit('stop video', {
                        room: room_id
                    })
                }
                
            })

            mediaObj.on(mediaEvents.changeViewers, async (data) => {
                let {room_id} = data;
                if (room_id) {
                    let viewers = await mediaClientRef.current.getViewers(room_id);
                    dispatch({
                        type: 'update',
                        data: {
                            name: room_id,
                            viewers
                        }
                    })
                }
            })

            if(mediaClientRef.current) {
                mediaClientRef.current = null;
            }

            mediaClientRef.current = mediaObj;
        }

        return () => {
            if(mediaObj) {
                mediaObj.offAll();
                mediaObj.exit(true);
                mediaObj = null;
            }
        }
    }, [myId, username, socketWorkerRef])

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
                    let {room, reason, role, adminName, banReason} = data;
                    removeRoom(room, (result, message) => {
                        if(result) {
                            let alertText = null;
                            if (reason === 'kick') {
                                alertText = t('ChatApp.error_kicked', {roomName: room, userRole: role, adminName})
                            } else if (reason = 'ban') {
                                if (banReason && banReason !== '') {
                                    alertText = t('ChatApp.error_ban_with_reason', {roomName: room, userRole: role, adminName, reason: banReason});
                                } else {
                                    alertText = t('ChatApp.error_ban', {roomName: room, userRole: role, adminName});
                                }
                            } else {
                                return;
                            }
                            enqueueSnackbar(alertText, {variant: 'error'});
                        } else {
                            // console.log(result, message)
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
            pokeAudioControls1.unmute();
            pokeAudioControls2.unmute();
            pokeAudioControls3.unmute();
            pokeAudioControls4.unmute();
        } else {
            pokeAudioControls1.mute();
            pokeAudioControls2.mute();
            pokeAudioControls3.mute();
            pokeAudioControls4.mute();
        }
    }, [enablePokeSound, pokeAudioControls1, pokeAudioControls2, pokeAudioControls3, pokeAudioControls4])

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
        globalCameraBans,
        privateListRef,
        changeRoom,
        removeRoom,
        addRoom,
        addMessage,
        sendMessage,
        sendPokeMessage,
        changeMuteState,
        kickUser,
        banUser,
        stopBroadcastTo,
        sendGift,
        blockUser,
        unBlockUser,
        unbanCamera,
        pokeAudio1,
        pokeAudio2,
        pokeAudio3,
        pokeAudio4,
        privateAudio,
        publicAudio,
        requestAudio,
        openDisconnectModal,
        setOpenDisconnectModal,
        mediaClientRef,
        openPasswordModal,
        setOpenPasswordModal,
        openGiftModal,
        setOpenGiftModal,
        giftUsername,
        setGiftUsername,
        roomNameForPassword,
        gift,
        setGift,
        roomNameForGift,
        setRoomNameForGift,
        startBroadcast,
        stopBroadcast,
        controlVideo,
        viewBroadcast,
        leaveFromPrivate,
        addOrOpenPrivate
    }
}

export default useRooms;
import React, { useState, useEffect, useContext, useRef, forwardRef, useImperativeHandle } from 'react';
import {
    AppBar,
    Card,
    Hidden,
    IconButton,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import MenuIcon from '@material-ui/icons/Menu';
import { useSnackbar } from 'notistack';
import SideBarLeft from '../SidebarLeft'
import useStyles from './styles'
import ChatRoomContent from '../ChatRoomContent';
import AddRoomModal from '../Modals/AddRoomModal';
import PasswordModal from '../Modals/PasswordModal'
import PrivateChatList from '../PrivateChat/PrivateChatList'
import VideoList from '../VideoList';
import Peer from 'simple-peer';
import {StyledTab , StyledTabs} from '../StyledTab';
import DisconnectModal from '../Modals/DisconncetModal'
import RoomObject from '../../utils/roomObject';
import UserContext from '../../context';
import { getSocket, useLocalStorage, isPrivateRoom } from '../../utils';
import {useAudio} from 'react-use';
import { useTranslation, withTranslation, Trans } from 'react-i18next';

const ChatRooms = ({room, addUnReadMsg}, ref) => {
    const classes = useStyles();
    const { t, i18n } = useTranslation();
    const history= useHistory();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { username, avatar, gender } = useContext(UserContext);
    const [mutes, setMutes] = useLocalStorage('mutes', []);
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const socket = getSocket();
    // roomObject array
    const roomsRef = useRef([]);
    // current room index
    const [roomIndex, setRoomIndex] = useState(null);

    const [roomsInfo, setRoomsInfo] = useState([]);
    const [currentRoom, setCurrentRoom] = useState(null);
    const [currentRoomMessages, setCurrentRoomMessages] = useState([]);
    const [currentRoomUsers, setCurrentRoomUsers] = useState([]);
    const [currentRoomName, setCurrentRoomName] = useState(null);
    const [currentRoomMutes, setCurrentRoomMutes] = useState([]);
    // receive new message
    const [newMessage, setNewMessage] = useState([]);
    // receive new infomation for rooms
    const [newInfo, setNewInfo] = useState(null);
    // private chat send message to this user
    const [privateTo, setPrivateTo] = useState(null);
    const [privateMessgaes, setPrivateMessages] = useState(null);
    const [openDisconnectModal, setOpenDisconnectModal] = useState(false);
    const [openPasswordModal, setOpenPasswordModal] = useState(false);
    const [roomNameForPassword, setRoomNameForPassword] = useState('');
    const privateListRef = useRef();

    // const audio = new Audio('/media/poke.mp3');
    // const audio = new Audio('/media/new_message.mp3');
    const [pokeAudio, pokeAudioState, pokeAudioControls] = useAudio({
        src: '/media/poke.mp3',
        autoPlay: false ,
    });
    const [messageAudio, messageAudioState, messageAudioControls] = useAudio({
        src: '/media/new_message.mp3',
        autoPlay: false ,
    });
    const peersRef = useRef([]);
    // video stream objects
    const [currentStreams, setCurrentStreams] = useState([]);
    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    
    useImperativeHandle(ref, () => ({
        openPrivate: (userToChat) => {
            addOrOpenPrivate(userToChat);
        }
    }));


    const handleChangeRoom = (event, newValue) => {
        setRoomIndex(newValue);
    };
    // add a private modal to private list
    const addOrOpenPrivate = (to) => {
        if(!privateListRef.current.openChat(to)) {
            socket.emit('open private', {from: username, to: to.username}, (roomName) => {
                if(roomName) {
                    privateListRef.current.addChat(to, roomName);
                } else {
                    console.log('private chat error');
                }
            });
        }
    }
    // mute or unmute user
    const changeMuteState = (roomName, usernameToMute, isMuted) => {
        let room = roomsRef.current.find((item) => (item.name === roomName));
        if(room) {
            
            // let userInfo = room.users.find((user) => (user.username === usernameToMute));
            
            // let localMute = mutes.find((item) => (item.room === roomName && item.user === usernameToMute))
            if(isMuted) {
                let newMutes = mutes.filter((item) => (item.room !== roomName || item.user !== usernameToMute));
                setMutes(newMutes);
                // if(!userInfo || (userInfo && !userInfo.blocked)) {
                if(!room.deleteMute(usernameToMute)) {
                    enqueueSnackbar('This user was blocked', {variant: 'error'});
                }
                // }
                
            } else {
                let localMute = mutes.find((item) => (item.room === roomName && item.user === usernameToMute))
                if(!localMute) {
                    let newMutes = [...mutes, {room: roomName, user: usernameToMute}];
                    setMutes(newMutes);
                }
                // if(!userInfo || (userInfo && !userInfo.blocked)) {
                    room.addMute(usernameToMute);
                // }
                
            }
            if(room.name === currentRoomName) {
                // setCurrentRoomUsers([...room.users]);
                setCurrentRoomMutes([...room.mutes]);
            }
        }
    }
    
    // kick a user from room
    const kickUser = (roomName, usernameToKick) => {
        socket.emit('kick user', {room: roomName, to: usernameToKick});
    }
    const banUser = (roomName, usernameToBan) => {
        socket.emit('ban user', {room: roomName, to: usernameToBan});
    }
    // remove a room
    // const removeRoom = (roomName) => {
    //     const rooms = roomsRef.current.filter((item) => (item.name))
    // }
    // send message
    const joinErrorHandler = (error) => {
        enqueueSnackbar(error, {variant: 'error'});
        if(roomIndex === null) {
            setRoomIndex(0);
        }
    }
    const sendMessage = (roomName, to, color, msg, bold, type, messageType) => {
        if (msg) {
            if(type === 'private') {
                socket.emit('private message',
                    { type, roomName, msg, from: username, to, color, bold, messageType },
                    (data) => {
                        if(data) {
                            let message = data;
                            privateListRef.current.addMessage(message, roomName);
                        } else {
                            // enqueueSnackbar(to + ' was out of chat. Please close the private chat with '+ to +'.', {variant: 'error'});
                            privateListRef.current.addErrorMessage(roomName);
                        }
                        
                    }
                );
                
            } else{
                socket.emit('public message', { type, msg, room: roomName, from: username, color, bold, messageType }, (data) => {
                    let sameRoom = roomsRef.current.find((room) => (room.name) === roomName);
                    if(sameRoom && data) {
                        sameRoom.messages = [ data, ...sameRoom.messages,];
                        if(sameRoom.name === currentRoomName) {
                            setCurrentRoomMessages([...sameRoom.messages]);
                        }
                    }
                });
                
            }
        }
    }
    const leaveFromPrivate = (roomName) => {
        socket.emit('leave private', roomName);
    }
    // send poke message
    const sendPokeMessage = (roomName, userToSend) => {
        socket.emit('poke message', {from: username, to: userToSend, room: roomName}, (response) => {
            // this is callback function that can excute on server side
            if(response !== 'success') {
                enqueueSnackbar('Error', {variant: 'error'});
            } else {
                let sameRoom = roomsRef.current.find((room) => (room.name) === roomName);
                if(sameRoom) {
                    let message = {
                        type: 'poke',
                        msg: 'You sent a rington to ' + userToSend,
                    }
                    sameRoom.messages = [message, ...sameRoom.messages];
                    if(sameRoom.name === currentRoomName) {
                        setCurrentRoomMessages([...sameRoom.messages]);
                    }
                }
            }
        });
        
    }
 /*********************************  camera   ******************************************/
    const createPeer = (userToSignal, callerID, room, stream) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            config: { iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }, 
                { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }
            ] },
            sdpTransform: function (sdp) { return sdp },
            stream: stream,
        });

        peer.on('signal', signal => {
            socket.emit('sending video signal', { from: callerID, to: userToSignal, room, signal });
        })

        peer.on('close', () => {
            removeMyStream(room.name);
        })

        peer.on('error', (err) => {
            removeMyStream(room.name);
        })
        return peer;
    }

    const addPeer = async (incomingSignal, callerID, room) => {
        const peer = new Peer({
            initiator: false,
            trickle: false,
            config: { iceServers: [
                { urls: 'stun:stun.l.google.com:19302' }, 
                { urls: 'stun:global.stun.twilio.com:3478?transport=udp' }
            ] },
            sdpTransform: function (sdp) { return sdp },
        })

        peer.signal(incomingSignal);

        peer.on('signal', signal => {
            // console.log('return video signal')
            socket.emit('returning video signal', { from: username, to: callerID, room: room.name,  signal});
        })

        peer.on('stream', stream => {
            // console.log('success stream', stream, room);
            addStream(room.name, callerID, stream);
            // setRemoteStreams([...remoteStreams, {room, streamID: callerID, stream}]);
        })

        peer.on('close', () => {
            // console.log('close video');
            removeStream(room.name, callerID);
            // setRemoteStreams(newStreams);
        })

        peer.on('error', (err) => {
            // console.log('peer error', err);
            removeStream(room.name, callerID);
        })
    }
    // add a new stream to room object
    const addStream = (roomName, callerID, stream) => {
        let room = roomsRef.current.find((item) => (item.name === roomName));
        room.remoteStreams.push({streamID: callerID, stream});
        if(roomName === currentRoom.name) {
            setCurrentRoom({...room});
        }
    }
    // remove a stream form room object
    const removeStream = (roomName, streamID) => {
        let room = roomsRef.current.find((item) => (item.name === roomName));
        const newStreams = room.remoteStreams.filter((item) => (item.streamID !== streamID));
        room.remoteStreams = newStreams;
        if(roomName === currentRoom.name) {
            setCurrentRoom({...room});
        }
    }
    const removeMyStream = (roomName) => {
        let room = roomsRef.current.find((item) => (item.name === roomName));
        if(room) {
            room.myStream = null;
            room.cameraState = false;
            if(roomName === currentRoom.name) {
                setCurrentRoom({...room});
            }
        }
    }
    // open my camera
    const openCamera = async () => {
        // console.log('open camera');
        navigator.getUserMedia = (navigator.getUserMedia ||
            navigator.webkitGetUserMedia ||
            navigator.mozGetUserMedia ||
            navigator.msGetUserMedia);
        // console.log(navigator.mediaDevices.getUserMedia)
        // console.log(navigator.getUserMedia)
        // console.log(navigator.mediaDevices.enumerateDevices())
        let stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        });
        // console.log(stream);
        let room = roomsRef.current[roomIndex];
        // setCameraState(true);
        // setMyStream({room: room.name, stream});
        room.cameraState = true;
        room.myStream = stream;
        room.users.forEach((user) => {
            // console.log(user, username);
            if(user.username !== username) {
                const peer = createPeer(
                    user.username,
                    username,
                    room.name,
                    stream
                );
                peersRef.current.push({room: room.name, peerID: user.username ,peer});
            }
        });
        setCurrentRoom({...room});
        // console.log(room);
        // console.log('set current room to open camera');
    }
    const closeCamera = () => {
        let roomObject = roomsRef.current[roomIndex];
        // console.log('set current room to close room', roomObject, peersRef.current);
        if(roomObject) {
            if(peersRef.current.length > 0) {
                peersRef.current.forEach((item) => {if(item.room === room) item.peer.destroy()});
                peersRef.current = peersRef.current.filter((item) => (item.room !== room));
            }
            roomObject.myStream = null;
            roomObject.cameraState = false;
            console.log('set current rooom due to close camera')
            setCurrentRoom({...roomObject});
            // console.log('set current room to close room', roomObject);
        }
    }
/*************************************************************** */
    // useEffect(() => {
    //     if(room) {
    //         setRoomIndex(0);
    //     }
    // }, [room]);

    // receive new message
    useEffect(() => {
        if( roomIndex !== null && newMessage && newMessage.message) {
            // for (let msgIndex = 0; msgIndex < newMessages.length; msgIndex++) {   
                // const newMessage = newMessages[msgIndex]; 
                if(newMessage.message.type === 'public') {
                    let room = roomsRef.current.find((item) => (item.name === newMessage.message.room))
                    if(room && newMessage.message.msg) {
                        if(newMessage.message.msg) {
                            let userToReceive = room.users.find((item) => (item.username === newMessage.message.from));
                            if(userToReceive && !userToReceive.muted) {
                                messageAudioControls.seek(0);
                                messageAudioControls.play();
                            }
                            if(currentRoomName !== room.name) {
                                room.unReadMessages = [newMessage.message, ...room.unReadMessages];
                            } else {
                                room.messages = [ newMessage.message, ...room.messages];
                            }
                        }
                        if(newMessage.message.onlineUsers) {
                            room.users = [...newMessage.message.onlineUsers];
                        }
                        if(currentRoomName === room.name) {
                            // setCurrentRoom({...room});
                            setCurrentRoomName(room.name);
                            setCurrentRoomMessages([...room.messages]);
                            setCurrentRoomUsers([...room.users]);
                        }
                    } 
                    
                } else if(newMessage.message.type==='private' && newMessage.message.msg && newMessage.message.to) {
                    if(!privateListRef.current.addMessage(newMessage.message, newMessage.message.roomName)) {
                        addUnReadMsg(newMessage.message);
                    }
                    if(newMessage.callback) {
                        newMessage.callback(true);
                    }
                    messageAudioControls.seek(0);
                    messageAudioControls.play();
                }
            // }
            let infos = roomsRef.current.map(({name, unReadMessages}) => ({name, unReadMessages}));
            setRoomsInfo(infos);
        }
    }, [newMessage])

    // socket events
    useEffect(() => {
        if(username && socket) {
            let result = socket.open();
            isPrivateRoom(room, ({isPrivate}) => {
                if(isPrivate) {
                   setRoomNameForPassword(room);
                   setOpenPasswordModal(true);
                } else {
                    socket.emit('join room', { room }, (result, message) => {
                        if(!result) {
                            enqueueSnackbar(message, {variant: 'error'});
                            setRoomIndex(0);
                        }
                    });
                }
            }, (err) => {
                console.log(err);
            })
            
            socket.on('connect_error', (err) => {
                console.log(err)
            })
            socket.on('init room', async ({room, onlineUsers, messages, blocks}, fn) => {
                fn('success');
                let usernames = await onlineUsers.map((item) => (item.username));
                if(usernames.includes(username)) {
                    // console.log('username: ', username);
                    setNewInfo({ type: 'init room', payload: { room, onlineUsers, messages, blocks}});
                }
            });
            socket.on('joined room',async ({room, onlineUsers, joinedUser}) => {
                // console.log('new info for user join')
                setNewInfo({type: 'joined room', payload: {room, onlineUsers, joinedUser}});
            });
            socket.on('leave room', async ({room, onlineUsers, leavedUser}) => {
                console.log('leave room', onlineUsers, leavedUser)
                setNewInfo({type: 'leave room', payload: {room, onlineUsers, leavedUser}});
            });
            socket.on('kicked user', async ({room, kickedUserName}) => {
                setNewInfo({type: 'kicked', payload: {room, kickedUserName, type: 'kick'}});
            });
            socket.on('banned user', async ({room, kickedUserName}) => {
                setNewInfo({type: 'kicked', payload: {room, kickedUserName, type: 'ban'}}); 
            });
            socket.on('global banned user', async ({kickedUserName}) => {
                setNewInfo({type: 'kicked', payload: { kickedUserName, type: 'global ban'}}); 
            });
            socket.on('update block', ({room, onlineUsers, blocks}) => {
                setNewInfo({type: 'update block', payload: { room, onlineUsers, blocks}}); 
            })
            socket.on('room message', (message, callback) => {
                setNewMessage({message, callback});
            });
            // socket.on('private message', (message, callback) => {
            // })
            socket.on('poke message', payload => {
                setNewInfo({type: 'poke', payload});
            })

            socket.on('video signal', payload => {
                // console.log('receive new video');
                setNewInfo({ type: 'video', payload});
            });

            socket.on('return video signal', payload => {
                setNewInfo({type: 'return video', payload});
            });

            socket.on('join error', payload => {
               joinErrorHandler(payload);
            })

            socket.on('hey', (payload, callback) => {
                console.log('hey response')
                callback(true);
            })

            socket.on('disconnect', (reason) => {
                setOpenDisconnectModal(true);
                if (reason === 'io server disconnect') {
                    // the disconnection was initiated by the server, you need to reconnect manually
                    socket.connect();
                }
            })

            socket.on('connect_error', (err) => {
                console.log('connect_error', err);
            })

            socket.io.on('reconnect', () => {
                let roomNames = roomsRef.current.map((room) => (room.name));
                roomNames.map((roomName) => {
                    console.log('rejoin room', roomName, )
                    socket.emit('rejoin room',{room: roomName}, (result) => {
                        if(result) {
                            console.log('rejoin success') 
                        } else {
                            console.log('rejoin fail')
                        }
                        
                    })
                });
                setOpenDisconnectModal(false)
            })

            socket.io.on('reconnect_attempt', () => {
                console.log('reconnect_attempt');

            })
            socket.on('connect', () => {
                console.log('connect',socket);
            })

            socket.on('repeat connection', () => {
                console.log('repeat connect');
                enqueueSnackbar('This user already is in chat', {variant: 'error'});
                history.push('/');
            })

            return () => {
                socket.removeAllListeners();
                socket.close();
            };
        }
    }, [socket, username]);

    // add a new room to chat area
    const addRoom = async (room, callback) => {
        let roomNames = await roomsRef.current.map((oneRoom) => (oneRoom.name));
            if(room && roomNames && !roomNames.includes(room)) {
                isPrivateRoom(room, ({isPrivate}) => {
                    if(isPrivate) {
                        setRoomNameForPassword(room);
                        setOpenPasswordModal(true);
                    } else {
                        socket.emit('join room', { room }, (result, message) => {
                            if(result) {
                                
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
            callback(false);
        }
    }
    // remove a room from chat area
    const removeRoom = async (room, callback) => {
        let roomNames = await roomsRef.current.map((oneRoom) => (oneRoom.name));
        if(room && roomNames && roomNames.length > 0 && roomNames.includes(room)) {
            let newRooms = await(roomsRef.current.filter((oneRoom) => (oneRoom.name !==room)));
            roomsRef.current = newRooms;
            // console.log('remove a room');
            let infos = roomsRef.current.map(({name, unReadMessages}) => ({name, unReadMessages}));
            setRoomsInfo(infos);
            if(callback) callback(true);
        } else {
            if(callback) callback(false);
        }
    }
    // leave room by you
    const leaveRoomByUser = (room) => {
        removeRoom(room, (result) => {
            if(result) {
                socket.emit('leave room', {room});
            }
        })
    }

    const receiveNewInfo = async (newInfo) => {
        switch(newInfo.type) {
            case 'init room':
                if(roomsRef.current && newInfo.payload.room) {
                    let sameRoom = await roomsRef.current.find((room) => (room.name === newInfo.payload.room.name));
                    if(!sameRoom) {
                        let usernames = await newInfo.payload.onlineUsers.map((item) => (item.username));
                        if(username && usernames.includes(username)) {
                            // console.log('init room messages',newInfo.payload)
                            let messages = newInfo.payload.messages;
                            if(newInfo.payload.room.welcomeMessage) {
                                let wcMsg = {
                                    type: 'system',
                                    msg: newInfo.payload.room.welcomeMessage
                                };
                                messages = [wcMsg, ...messages];
                            }
                            
                            let newRoomObject = new RoomObject(newInfo.payload.room.name, messages, newInfo.payload.onlineUsers, newInfo.payload.blocks,);
                            roomsRef.current.push(newRoomObject);
                            setRoomIndex(roomsRef.current.length-1);
                            return;
                        } else {
                            // remove this room
                            let newRooms = await(roomsRef.current.filter((room) => (room.name !== newInfo.payload.room)));
                            roomsRef.current = newRooms;
                        }
                    } else {
                        let usernames = await newInfo.payload.onlineUsers.map((item) => (item.username));
                        if(username && usernames.includes(username)) {
                            if(newInfo.payload.onlineUsers) {
                                let users = newInfo.payload.onlineUsers.map((user) => ({...user, muted: false}))
                                sameRoom.users = users;
                            }
                            if(newInfo.payload.messages) {
                                sameRoom.messages = newInfo.payload.messages;
                            }
                        } else {
                            let newRooms = await(roomsRef.current.filter((room) => (room.name !==newInfo.payload.room)));
                            roomsRef.current = newRooms;
                        }
                    }
                }
                break;
            case 'joined room':
                if(roomsRef.current && newInfo.payload.room) {
                    let sameRoom = await roomsRef.current.find((room) => (room.name === newInfo.payload.room));
                    if(sameRoom) {
                        let usernames = await newInfo.payload.onlineUsers.map((item) => (item.username));
                        if(username && usernames.includes(username)) {
                            if(newInfo.payload.onlineUsers && newInfo.payload.joinedUser) {
                                let joinedUser = newInfo.payload.joinedUser;
                                sameRoom.addOnlineUser(joinedUser);
                                if(username !== joinedUser.username) {
                                    let sysMsg = {
                                        type: 'system',
                                        msg: joinedUser.username + ' joined the room'
                                    }
                                    sameRoom.messages = [sysMsg, ...sameRoom.messages];
                                }
                            }
                        }
                        if(sameRoom.name === currentRoomName) {
                            setCurrentRoomMessages([...sameRoom.messages]);
                            setCurrentRoomUsers([...sameRoom.users]);
                        }
                    }
                }
                break;
            case 'leave room':
                if(roomsRef.current && newInfo.payload.room) {
                    let sameRoom = await roomsRef.current.find((room) => (room.name === newInfo.payload.room));
                    if(sameRoom) {
                        let leavedUser = newInfo.payload.leavedUser;
                        console.log('leave user', leavedUser, sameRoom.users)
                        let usernames = await newInfo.payload.onlineUsers.map((item) => (item.username));
                        if(username && usernames.includes(username)) {
                            let leavedUserInfo = sameRoom.users.find((user) => (user._id === leavedUser));
                            if(leavedUserInfo) {
                                let usersToSet = sameRoom.users.filter((user) => (user._id !== leavedUser));
                                sameRoom.users = usersToSet;
                                let message = {
                                    type: 'system',
                                    msg: leavedUserInfo.username + ' leaved room' 
                                }
                                sameRoom.messages = [message, ...sameRoom.messages];
                            }
                        } else {
                            //you leaved from room by server
                        }
                        if(sameRoom.name === currentRoomName) {
                            setCurrentRoomMessages([...sameRoom.messages]);
                            setCurrentRoomUsers([...sameRoom.users]);
                        }
                    }
                }
                break;
            case 'kicked':
                if(roomsRef.current && newInfo.payload.room) {
                    let sameRoom = await roomsRef.current.find((room) => (room.name === newInfo.payload.room));
                    if(sameRoom) {
                        if(username !== newInfo.payload.kickedUserName) { // kick other
                            let usersToSet = sameRoom.users.filter((user) => (user.username !== newInfo.payload.kickedUserName));
                            sameRoom.users = usersToSet;
                            let type = newInfo.payload.type;
                            let msg = (type === 'kick') 
                                ? newInfo.payload.kickedUserName + ' kicked from room'
                                : newInfo.payload.kickedUserName + ' baned from room';
                            let message = {
                                type: 'system',
                                msg
                            }
                            sameRoom.messages = [message, ...sameRoom.messages];
                            if(sameRoom.name === currentRoomName) {
                                setCurrentRoomMessages([...sameRoom.messages]);
                                setCurrentRoomUsers([...sameRoom.users]);
                            }
                        } else { // kick you
                            removeRoom(newInfo.payload.room, (result) => {
                                if(result) {
                                    let alertText = (newInfo.payload.type === 'kick') 
                                        ?'You kicked from '+newInfo.payload.room
                                        :'You baned from '+newInfo.payload.room;
                                    enqueueSnackbar(alertText, {variant: 'error'});
                                }
                                
                            })
                        }
                        
                    }
                } else if(roomsRef.current.length && newInfo.payload.type === 'global ban') {
                    if(username !== newInfo.payload.kickedUserName) {
                        roomsRef.current.map((roomRef) => {
                         // kick other
                            let usersToSet = roomRef.users.filter((user) => (user.username !== newInfo.payload.kickedUserName));
                            roomRef.users = usersToSet;
                            let msg = newInfo.payload.kickedUserName + ' baned from room';
                            let message = {
                                type: 'system',
                                msg
                            }
                            roomRef.messages = [message, ...roomRef.messages];
                            if(roomRef.name === currentRoomName) {
                                setCurrentRoomMessages([...roomRef.messages]);
                                setCurrentRoomUsers([...roomRef.users]);
                            }
                        
                        })
                    }
                    else { // kick you
                        // remove all room
                        roomsRef.current = [];
                        setRoomsInfo([]);
                        let alertText = 'You baned globally';
                        enqueueSnackbar(alertText, {variant: 'error'});
                    }
                }
                break;
            case 'poke':
                if(roomsRef.current && newInfo.payload.room) {
                    let sameRoom = await roomsRef.current.find((room) => (room.name === newInfo.payload.room));
                    if(sameRoom) {
                        let pokeMessage = newInfo.payload;
                        if(pokeMessage.to === username) {
                            let message = {
                                type: 'poke',
                                from: pokeMessage.from,
                                msg: pokeMessage.from + ' sent a rington to you' 
                            }
                            sameRoom.messages = [message, ...sameRoom.messages];
                            let userToReceive = sameRoom.users.find((item) => (item.username === pokeMessage.from));
                            if(userToReceive && !userToReceive.muted) {
                                pokeAudioControls.seek(0);
                                pokeAudioControls.play()
                            }
                        }
                    }
                }
                break;
            case 'update block':
                if(roomsRef.current && newInfo.payload.room) {
                    let {room, onlineUsers, blocks} = newInfo.payload;
                    let sameRoom = await roomsRef.current.find((room) => (room.name === newInfo.payload.room));
                    if(sameRoom) {
                        sameRoom.setOnlineUsers(onlineUsers);
                        sameRoom.initMutes(onlineUsers, blocks);
                    }
                    if(room === currentRoomName) {
                        setCurrentRoomMutes([...sameRoom.mutes]);
                        setCurrentRoomUsers([...sameRoom.users]);
                    }
                }
                
                break;
            case 'video':
                // console.log('process video')
                let { from, room, signal } = newInfo.payload;
                let roomObject = roomsRef.current.find((item) => (item.name === room));
                if(roomObject) {
                    addPeer(signal, from, roomObject);
                }
                break;
            case 'return video':
                // console.log('return video',newInfo.payload)
                let item = peersRef.current.find((p) => (p.room === newInfo.payload.room && p.peerID === newInfo.payload.from));
                // console.log(peersRef.current);
                if(item) {
                    // console.log(item);
                    item.peer.signal(newInfo.payload.signal);
                }
                break;
            default:
                break;
        }
        // setCurrentRoom({...roomsRef.current[roomIndex]});
        // setCurrentRoomMessages([...roomsRef.current[roomIndex].messages]);
        // setCurrentRoomUsers([...roomsRef.current[roomIndex].users]);
        let infos = roomsRef.current.map(({name, unReadMessages}) => ({name, unReadMessages}));
        setRoomsInfo(infos); 
    }
    useEffect(() => {
        // console.log('new info processing', newInfo)
        if(newInfo) receiveNewInfo(newInfo);
        if(roomsRef.current.length > 0 && roomsRef.current.length < roomIndex + 1) {
            setRoomIndex(roomsRef.current.length - 1)
        } else {
           
        }
        
    }, [newInfo]);

    useEffect(() => {
        if(roomsRef.current.length > 0 && roomsRef.current.length < roomIndex + 1) {
            setRoomIndex(roomsRef.current.length - 1)
        } else if( roomsRef.current.length === 0 && roomIndex !== null) {
            history.push('/');
        } else {
            if(roomsRef.current[roomIndex]) {
                setCurrentRoomUsers([...roomsRef.current[roomIndex].users]);
                setCurrentRoomMessages([...roomsRef.current[roomIndex].messages]);
                setCurrentRoomName(roomsRef.current[roomIndex].name);
                setCurrentRoomMutes(roomsRef.current[roomIndex].mutes);
            }
        }
    }, [roomsInfo, roomIndex])

    useEffect(() => {
        if(roomsRef.current.length > 0 && roomsRef.current.length > roomIndex) {
            roomsRef.current[roomIndex].messages = [ ...roomsRef.current[roomIndex].unReadMessages, ...roomsRef.current[roomIndex].messages];
            roomsRef.current[roomIndex].unReadMessages = [];
            setCurrentRoomMessages([...roomsRef.current[roomIndex].messages]);
            setCurrentRoomUsers([...roomsRef.current[roomIndex].users]);
            setCurrentRoomName(roomsRef.current[roomIndex].name);
            let infos = roomsRef.current.map(({name, unReadMessages}) => ({name, unReadMessages}));
            setRoomsInfo(infos);
        }
    }, [roomIndex]);

    useEffect(() => {
        if(currentRoom) {
            let curStreams = [];
            if(currentRoom.myStream) {
                curStreams.push(currentRoom.myStream);
            }
            if(currentRoom.remoteStreams && currentRoom.remoteStreams.length) {
                let curRemoteStreams = currentRoom.remoteStreams.map((item) => (item.stream))
                curStreams = [...curStreams, ...curRemoteStreams];
            }
            setCurrentStreams(curStreams);
        }
    }, [currentRoom])

    return (
        <>
        <div className={classes.root} color="primary">
            <Hidden xsDown implementation="css" className={classes.drawerWrapper}>
                <div className={classes.drawer}>
                    <SideBarLeft
                        users={currentRoomUsers}
                        changeMuteState={changeMuteState}
                        sendPokeMessage={sendPokeMessage}
                        kickUser={kickUser}
                        banUser={banUser}
                        // unReadInfo={currentRoom && currentRoom.private}
                        roomName={currentRoomName}
                        mutes={currentRoomMutes}
                        // setOpenPrivate={setOpenPrivate}
                        // setPrivateTo={setPrivateTo}
                        addOrOpenPrivate={addOrOpenPrivate}
                        cameraState={currentRoom && currentRoom.cameraState}
                        openCamera = {openCamera}
                        closeCamera = {closeCamera}
                        username={username}
                    />  
                </div>
            </Hidden>
            
            <div className={classes.mainWrapper}>
                <AppBar className={classes.chatBar} position="static">
                    <div className={classes.chatBarContent}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerToggle}
                        className={classes.menuButton}
                    >
                        <MenuIcon />
                    </IconButton>
                    <StyledTabs value={roomIndex && roomsInfo.length > roomIndex && roomIndex} variant="scrollable" onChange={handleChangeRoom}>
                        { roomsInfo.length>0 &&
                            roomsInfo.map((item, index) => (
                                <StyledTab
                                    key={index} label={<span>{item.name}</span>}
                                    unRead={item.unReadMessages.length}
                                    onClose={roomsInfo.length < 2 ? null: () => leaveRoomByUser(item.name)}
                                />
                            ))
                        }
                    </StyledTabs>
                    <AddRoomModal addRoom={addRoom}/>
                    </div>
                </AppBar>
                <Hidden smUp implementation="css">
                    { mobileOpen &&
                        <Card className={classes.modbileDrawer}>
                            <SideBarLeft 
                            users={currentRoomUsers}
                            changeMuteState={changeMuteState}
                            sendPokeMessage={sendPokeMessage}
                            kickUser={kickUser}
                            banUser={banUser}
                            // unReadInfo={currentRoom && currentRoom.private}
                            roomName={currentRoomName}
                            mutes={currentRoomMutes}
                            // setOpenPrivate={setOpenPrivate}
                            // setPrivateTo={setPrivateTo}
                            addOrOpenPrivate={addOrOpenPrivate}
                            cameraState={currentRoom && currentRoom.cameraState}
                            openCamera = {openCamera}
                            closeCamera = {closeCamera}
                            username={username}
                            />
                        </Card>
                    }
                </Hidden>
               
                <main className={classes.main}>
                    <div className={classes.content}>
                    { currentRoom && roomIndex !== null  &&
                        <VideoList streams={currentStreams}/>
                    }
                    {/* { currentRoom && roomIndex !== null && */}
                        <ChatRoomContent
                            roomName={currentRoomName}
                            username={username}
                            mutes={currentRoomMutes}
                            messages={currentRoomMessages}
                            sendMessage={sendMessage}
                            users={currentRoomUsers}
                            changeMuteState={changeMuteState}
                            sendPokeMessage={sendPokeMessage}
                            kickUser={kickUser}
                            banUser={banUser}
                            // unReadInfo={currentRoom && currentRoom.private}
                            // setOpenPrivate={setOpenPrivate}
                            // setPrivateTo={setPrivateTo}
                            addOrOpenPrivate={addOrOpenPrivate}
                        />
                    {/* } */}
                    </div>
                </main>
            </div>
        </div>
            {/* <PrivateChat open={openPrivate} setOpen={setOpenPrivate}
                me={{username, avatar, gender}} to={privateTo} room={currentRoom} messages={privateMessgaes}
            /> */}
        <PrivateChatList ref={privateListRef}
            sendMessage={sendMessage}
            leaveFromPrivate={leaveFromPrivate}
            me={{username, avatar, gender}} />
        <div>{pokeAudio}</div>
        <div>{messageAudio}</div>
        <DisconnectModal
            open={openDisconnectModal}
            setOpen={setOpenDisconnectModal}
        />
        <PasswordModal
            open={openPasswordModal}
            setOpen={setOpenPasswordModal}
            room={roomNameForPassword}
            onClose={() => {if(!roomIndex) setRoomIndex(0)}}
        />
        </>
    );
}
export default forwardRef(ChatRooms);
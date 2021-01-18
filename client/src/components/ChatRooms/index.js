import React, { useState, useEffect, useContext, useRef } from 'react';
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
import AddRoomModal from '../AddRoomModal';
import PrivateChatList from '../PrivateChat/PrivateChatList'
import VideoList from '../VideoList';
import Peer from 'simple-peer';
import {StyledTab , StyledTabs} from '../StyledTab';
import PrivateChat from '../PrivateChat';
import RoomObject from '../../utils/roomObject';
import UserContext from '../../context';
import { getSocket } from '../../utils';
import {getPrivateMessages} from '../../utils';
import {useAudio} from 'react-use';



const ChatRooms = ({room}) => {
    const classes = useStyles();
    const history= useHistory();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [openPrivate, setOpenPrivate] = useState(false);
    const { username, avatar, gender } = useContext(UserContext);
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
    // receive new message
    const [newMessages, setNewMessages] = useState([]);
    // receive new infomation for rooms
    const [newInfo, setNewInfo] = useState(null);
    // private chat send message to this user
    const [privateTo, setPrivateTo] = useState(null);
    const [privateMessgaes, setPrivateMessages] = useState(null);
    const privateListRef = useRef();

    // const audio = new Audio('/media/poke.mp3');
    // const audio = new Audio('/media/new_message.mp3');
    const [pokeAudio, pokeAudioState, pokeAudioControls] = useAudio({
        src: '/media/poke.mp3',
        autoPlay: true ,
    });
    const [messageAudio, messageAudioState, messageAudioControls] = useAudio({
        src: '/media/new_message.mp3',
        autoPlay: true ,
    });
    const peersRef = useRef([]);

    // video stream objects

    const [currentStreams, setCurrentStreams] = useState([]);

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    const handleChangeRoom = (event, newValue) => {
        setRoomIndex(newValue);
    };
    // add a private modal to private list
    const addOrOpenPrivate = (to) => {
        privateListRef.current.addChat({me: {username, avatar, gender}, to});
    }
    // mute or unmute user
    const changeMuteState = (roomName, usernameToMute) => {
        let room = roomsRef.current.find((item) => (item.name === roomName));
        if(room) {
            let user = room.users.find((item) => (item.username === usernameToMute));
            user.muted = !user.muted;
            if(room.name === currentRoomName) {
                setCurrentRoomUsers([...room.users]);
            }
        }
    }
    // send message
    const sendMessage = (roomName, to, color, msg, bold) => {
        if (msg) {
            const date = Date.now();
            let sameRoom = roomsRef.current.find((room) => (room.name) === roomName);
            let type = null;
            console.log('send message', roomName, to)
            if(to) {
                socket.emit('private message', { msg, from: username, to, date, color, bold });
                type = 'private';
                
            } else{
                socket.emit('public message', { msg, room: roomName, from: username, date, color, bold });
                type = 'public';
            }
            if(sameRoom) {
                let message = {
                    type,
                    msg,
                    from: username,
                    to,
                    date
                }
                sameRoom.messages = [...sameRoom.messages, message];
                if(sameRoom.name === currentRoomName) {
                    setCurrentRoomMessages([...sameRoom.messages]);
                }
            }
        }
        
        
    }
    // send poke message
    const sendPokeMessage = (roomName, userToSend) => {
        socket.emit('poke message', {from: username, to: userToSend, room: roomName}, (response) => {
            // this is callback function that can excute on server side
            if(response !== 'success') {
                enqueueSnackbar('Error', {variant: 'error'});
            }
        });
        let sameRoom = roomsRef.current.find((room) => (room.name) === roomName);
        if(sameRoom) {
            let message = {
                type: 'poke',
                msg: 'You sent a rington to ' + userToSend,
            }
            sameRoom.messages = [...sameRoom.messages, message];
            if(sameRoom.name === currentRoomName) {
                setCurrentRoomMessages([...sameRoom.messages]);
            }
            
        }
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
    function hasGetUserMedia() {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
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
        console.log('set current room with open camera')
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
        if( roomsRef.current.length && roomIndex !== null && newMessages && newMessages.length) {
            for (let index = 0; index < roomsRef.current.length; index++) {
                let room = roomsRef.current[index];
                for (let msgIndex = 0; msgIndex < newMessages.length; msgIndex++) {
                    const newMessage = newMessages[msgIndex];
                    // if message is for this room
                    if(newMessage.room === room.name) {
                        if(newMessage.type === 'public' && newMessage.msg) {
                            let userToReceive = room.users.find((item) => (item.username === newMessage.from));
                            if(userToReceive && !userToReceive.muted) {
                                messageAudioControls.seek(0);
                                messageAudioControls.play();
                            }
                            if(index !== roomIndex) {
                                room.unReadMessages = [...room.unReadMessages,...newMessages];
                            } else {
                                room.messages = [...room.messages, newMessage];
                            }
                        } else if(newMessage.type==='private' && newMessage.msg && newMessage.to && newMessage.from) {
                            // private message
                            if(index === roomIndex) {
                                let otherUser = null;
                                if(newMessage.from === username) {
                                    otherUser = newMessage.to;
                                } else if(newMessage.to === username) {
                                    otherUser = newMessage.from;
                                }  
                                if(otherUser && openPrivate && privateTo.username === otherUser) {
                                    // set private message to private message content
                                    setPrivateMessages([...privateMessgaes, newMessage])
                                } else {
                                    if(!room.private[otherUser]) {
                                        room.private[otherUser] = 0;
                                    }
                                    room.private[otherUser] ++;
                                }
                            }
                        }
                        if(newMessage.onlineUsers) {
                            room.users = [...newMessage.onlineUsers];
                        }

                        if(index === roomIndex) {
                            console.log('set current room due to new message')
                            // setCurrentRoom({...room});
                            setCurrentRoomName(room.name);
                            setCurrentRoomMessages([...room.messages]);
                            setCurrentRoomUsers([...room.users]);
                        }
                    }
                }
            }
            let infos = roomsRef.current.map(({name, unReadMessages}) => ({name, unReadMessages}));
            setRoomsInfo(infos);
        }
    }, [newMessages])

    // socket events
    useEffect(() => {
        // console.log('username', username)
        // console.log('socket opening')
        socket.open();
        // console.log('joining to', { room });
        socket.emit('join room', { room });
        socket.on('joined room',async ({room, onlineUsers, joinedUser}) => {
            // console.log('user joined', room, onlineUsers);
            // console.log('new info for user join')
            setNewInfo({type: 'joined room', payload: {room, onlineUsers, joinedUser}});
        });
        socket.on('leave room', async ({room, onlineUsers, leavedUser}) => {
            // console.log('leave room', userId, currentRoom);
            setNewInfo({type: 'leave room', payload: {room, onlineUsers, leavedUser}});
        })
        socket.on('init room', async ({room, onlineUsers, messages}) => {
            
            let usernames = await onlineUsers.map((item) => (item.username));
            if(usernames.includes(username)) {
                // console.log('socket init room', room, onlineUsers, messages);
                // console.log('username: ', username);
                setNewInfo({ type: 'init room', payload: { room, onlineUsers, messages}});
            }
        });
        socket.on('room messages', messages => {
            setNewMessages(messages);
        });

        socket.on('poke message', payload => {
            setNewInfo({type: 'poke', payload});
        })

        socket.on('video signal', payload => {
            // console.log('receive new video');
            setNewInfo({ type: 'video', payload});
        });

        socket.on('return video signal', payload => {
            setNewInfo({type: 'return video', payload});
        })

        return () => {
            socket.removeAllListeners();
            socket.disconnect();
        };
    }, []);

    // add a new room to chat area
    const addRoom = async (room, callback) => {
        let roomNames = await roomsRef.current.map((oneRoom) => (oneRoom.name));
        if(room && roomNames && roomNames.length > 0 && !roomNames.includes(room)) {
            socket.emit('join room', { room });
            callback(true);
        } else {
            callback(false);
        }
    }
    // remove a room from chat area
    const removeRoom = async (room, callback) => {
        let roomNames = await roomsRef.current.map((oneRoom) => (oneRoom.name));
        if(room && roomNames && roomNames.length > 0 && roomNames.includes(room)) {
            socket.emit('leave room', {room});
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

    const receiveNewInfo = async (newInfo) => {
        // console.log('new info for room', newInfo)
        switch(newInfo.type) {
            case 'init room':
                if(roomsRef.current && newInfo.payload.room) {
                    
                    let sameRoom = await roomsRef.current.find((room) => (room.name === newInfo.payload.room));
                    if(!sameRoom) {
                        let usernames = await newInfo.payload.onlineUsers.map((item) => (item.username));
                        if(username && usernames.includes(username)) {
                            // console.log('init room messages',newInfo.payload)
                            let newRoomObject = new RoomObject(newInfo.payload.room,newInfo.payload.messages, newInfo.payload.onlineUsers);
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
                                // sameRoom.users = [...newInfo.payload.onlineUsers];
                                let currentUserNames = sameRoom.users.map(({username}) => (username));
                                let joinedUser = newInfo.payload.joinedUser;
                                if(!currentUserNames.includes(joinedUser.username)) {
                                    sameRoom.users = [...sameRoom.users, {...joinedUser, muted: false}];
                                }
                                let tmpName = '';
                                if(username === joinedUser.username) {
                                    tmpName = 'you';
                                } else {
                                    tmpName = joinedUser.username;
                                }
                                let sysMsg = {
                                    type: 'system',
                                    msg: tmpName + ' joined room'
                                }
                                sameRoom.messages = [...sameRoom.messages, sysMsg];
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
                        let usernames = await newInfo.payload.onlineUsers.map((item) => (item.username));
                        if(username && usernames.includes(username)) {
                            if(newInfo.payload.onlineUsers) {
                                let leavedUser = newInfo.payload.leavedUser;
                                let usersToSet = sameRoom.users.filter((user) => (user.username !== leavedUser.username));
                                sameRoom.users = usersToSet;
                                let message = {
                                    type: 'system',
                                    msg: leavedUser.username + ' leaved room' 
                                }
                                sameRoom.messages = [...sameRoom.messages, message];
                            }
                        }
                        if(sameRoom.name === currentRoomName) {
                            setCurrentRoomMessages([...sameRoom.messages]);
                            setCurrentRoomUsers([...sameRoom.users]);
                        }
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
                            sameRoom.messages = [...sameRoom.messages, message];
                            let userToReceive = sameRoom.users.find((item) => (item.username === pokeMessage.from));
                            if(userToReceive && !userToReceive.muted) {
                                pokeAudioControls.seek(0);
                                pokeAudioControls.play()
                            }
                        }
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
            }
        }
        
    }, [roomsInfo])

    useEffect(() => {
        if(roomsRef.current.length > 0 && roomsRef.current.length > roomIndex) {
            roomsRef.current[roomIndex].messages = [...roomsRef.current[roomIndex].messages, ...roomsRef.current[roomIndex].unReadMessages];
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

    // useEffect(() => {
    //     if(openPrivate) {
    //         if(privateTo && currentRoom && roomIndex !==null) {
    //             getPrivateMessages({room: currentRoom.name, from: username, to: privateTo.username} ,
    //                 (data) => {
    //                     setPrivateMessages(data);
    //                 },
    //                 (err) => {
    //                     console.log(err);
    //                 }
    //             );
    //             if(currentRoom.private[privateTo.username]) {
    //                 let room = roomsRef.current[roomIndex];
    //                 room.private[privateTo.username] = 0;
    //                 setCurrentRoom({...room});
    //             }
    //         }
    //     }
    // }, [openPrivate, privateTo])

    return (
        <>
        
        <div className={classes.root} color="primary">
            <Hidden xsDown implementation="css" className={classes.drawerWrapper}>
                <div className={classes.drawer}>
                    <SideBarLeft
                        users={currentRoomUsers}
                        changeMuteState={changeMuteState}
                        sendPokeMessage={sendPokeMessage}
                        // unReadInfo={currentRoom && currentRoom.private}
                        roomName={currentRoomName}
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
                    <StyledTabs value={roomIndex} onChange={handleChangeRoom}>
                        { roomsInfo.length>0 &&
                            roomsInfo.map((item, index) => (
                                <StyledTab
                                    key={index} label={<span>{item.name}</span>} 
                                    unRead={item.unReadMessages.length}
                                    onClose={roomsInfo.length < 2 ? null: () => removeRoom(item.name)}
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
                            <SideBarLeft users={roomIndex !== null && currentRoom && currentRoom.users && currentRoom.users}
                                setOpenPrivate={setOpenPrivate}
                                setPrivateTo={setPrivateTo}
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
                            users={currentRoomUsers}
                            messages={currentRoomMessages}
                            sendMessage={sendMessage}
                        />
                    {/* } */}
                    </div>
                </main>
            </div>
        </div>
            {/* <PrivateChat open={openPrivate} setOpen={setOpenPrivate}
                me={{username, avatar, gender}} to={privateTo} room={currentRoom} messages={privateMessgaes}
            /> */}
        <PrivateChatList ref={privateListRef} sendMessage={sendMessage}/>
        <div>{pokeAudio}</div>
        <div>{messageAudio}</div>
        </>
    );
}
export default ChatRooms;
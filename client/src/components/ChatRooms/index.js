import React, { useState, useContext, forwardRef, useImperativeHandle, useRef } from 'react';
import {
    AppBar,
    Card,
    Hidden,
    IconButton,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { useSnackbar } from 'notistack';
import SideBarLeft from '../SidebarLeft'
import useStyles from './styles'
import ChatRoomContent from '../ChatRoomContent';
import AddRoomModal from '../Modals/AddRoomModal';
import PasswordModal from '../Modals/PasswordModal'
import PrivateChatList from '../PrivateChat/PrivateChatList'
import VideoList from '../VideoList';
import {StyledTab , StyledTabs} from '../StyledTab';
import DisconnectModal from '../Modals/DisconnectModal';
import GiftModal from '../Modals/GiftModal';
import GiftView from '../common/GiftView';
import {UserContext} from '../../context';
import { socket } from '../../utils';
import { useTranslation } from 'react-i18next';
import useRooms from './useRooms';
import {SettingContext, ChatContext} from '../../context';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Loading from '../Loading';

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

const ChatRooms = ({room}, ref) => {
    const classes = useStyles();
    const { t } = useTranslation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { username, avatar, gender, role } = useContext(UserContext);
    
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };
    const {messageTimeInterval, maxMessageLength} = useContext(SettingContext);
    const messageTimeRef = useRef(null);
    const matches = useMediaQuery('(min-width:1000px)');

    const {status, data: currentRoomData, error,
        roomsStatus,
        roomsData,
        roomIndex,
        roomsError,
        globalBlocks,
        globalCameraBans,
        privateListRef,
        changeRoom,
        addRoom,
        removeRoom,
        addMessage,
        changeMuteState,
        pokeAudio1,
        pokeAudio2,
        pokeAudio3,
        pokeAudio4,
        privateAudio,
        publicAudio,
        requestAudio,
        openDisconnectModal,
        setOpenDisconnectModal,
        openPasswordModal,
        setOpenPasswordModal,
        openGiftModal,
        setOpenGiftModal,
        giftUsername,
        setGiftUsername,
        roomNameForPassword,
        mediaClientRef,
        gift,
        setGift,
        roomNameForGift,
        setRoomNameForGift,
        startBroadcast,
        stopBroadcast,
        controlVideo,
        viewBroadcast
    } = useRooms({initRoomName: room});

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    
    useImperativeHandle(ref, () => ({
        openPrivate: (userToChat) => {
            addOrOpenPrivate(userToChat);
        }
    }));

    const handleChangeRoom = (index) => {
        if(index !== roomIndex) {
            changeRoom(index);
        }
    };
    // add a private modal to private list
    const addOrOpenPrivate = (to) => {
        if(!privateListRef.current.openChat(to)) {
            socket.emit('open private', {from: username, to: to.username, role}, (roomName, err) => {
                if(roomName) {
                    privateListRef.current.addChat(to, roomName);
                } else {
                    if(err === 'private_error_guest') {
                        enqueueSnackbar(t('UserActionArea.error_guest_dont_have_permission'), {variant: 'error'});
                    }
                }
            });
        }
    }
    
    // kick a user from room
    const kickUser = async (roomName, usernameToKick) => {
        socket.emit('kick user', {room: roomName, to: usernameToKick});
    }
    const banUser = async (roomName, usernameToBan) => {
        socket.emit('ban user', {room: roomName, to: usernameToBan});
    }
    // remove a room
    const sendMessage = async (roomName, to, color, msg, bold, type, messageType) => {
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
                socket.emit('private message',
                    { type, roomName, msg, from: username, to, color, bold, messageType },
                    async (data, err) => {
                        if(data) {
                            // let message = data;
                            // privateListRef.current.addMessage(message, roomName);
                        } else {
                            if(err === 'logout') {
                                privateListRef.current.addErrorMessage(roomName);
                            } else if (err === 'forbidden') {
                                enqueueSnackbar(t('Message.forbidden'), {variant: 'error'});
                            } else if (err === 'muted') {
                                enqueueSnackbar(t('Message.private_muted'), {variant: 'error'});
                            } else if (err === 'blocked') {
                                enqueueSnackbar(t('Message.private_blocked'), {variant: 'error'});
                            }
                            // enqueueSnackbar(to + ' was out of chat. Please close the private chat with '+ to +'.', {variant: 'error'});
                        }
                    }
                );
            } else {
                socket.emit('public message', { type, msg, room: roomName, from: username, color, bold, messageType }, async (data) => {
                    
                });
                addMessage({message: { _id: makeid(5), type, msg, room: roomName, from: username, color, bold, messageType, date }, room: roomName})
            }
        }
    };
    const leaveFromPrivate = async (roomName) => {
        socket.emit('leave private', roomName);
    }

    const stopBroadcastTo = async (roomName, userId, name) => {
        if(mediaClientRef.current) {
            mediaClientRef.current.stopView(roomName, userId, name);
        }
    }

    // send poke message
    const sendPokeMessage = async (roomName, userToSend, pokeType) => {
        socket.emit('poke message', {from: username, to: userToSend, room: roomName, pokeType}, (response) => {
            // this is callback function that can excute on server side
            if(response === 'muted') {
                enqueueSnackbar(t('PokeMessage.error_muted'), {variant: 'error'});
            } else if (response === 'success'){
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
        });
    }
/*************************************************************** */
    // leave room by you
    const leaveRoomByUser = async (room) => {
        removeRoom(room, (result) => {
            if(result) {
                socket.emit('leave room', {room});
            }
        })
    }

    return (
        <ChatContext.Provider value={{openGiftModal, setOpenGiftModal,
            giftUsername, setGiftUsername,
            roomNameForGift, setRoomNameForGift
            }}
        >
            <div className={classes.root} color="primary">
                <Hidden xsDown implementation="css" className={classes.drawerWrapper}>
                    <div className={classes.drawer}>
                    { (status === 'resolved' && currentRoomData) ?
                        <SideBarLeft
                            users={currentRoomData.users}
                            broadcastingUsers={currentRoomData.liveUsers}
                            viewers={currentRoomData.viewers}
                            changeMuteState={changeMuteState}
                            sendPokeMessage={sendPokeMessage}
                            kickUser={kickUser}
                            banUser={banUser}
                            roomName={currentRoomData.name}
                            mutes={currentRoomData.mutes}
                            blocks={currentRoomData.blocks}
                            globalBlocks={globalBlocks}
                            cameraBans={currentRoomData.cameraBans}
                            globalCameraBans={globalCameraBans}
                            addOrOpenPrivate={addOrOpenPrivate}
                            cameraState={currentRoomData.localStream? (currentRoomData.localStream.locked? 'locked': true): false}
                            startBroadcast={startBroadcast}
                            stopBroadcast={stopBroadcast}
                            stopBroadcastTo={stopBroadcastTo}
                            viewBroadcast={viewBroadcast}
                            username={username}
                        />  
                        : <Loading />
                    }
                    </div>
                </Hidden>
                <div className={matches? classes.chatWrapper: classes.mobileChatWrapper}>
                {
                    (status === 'resolved' && currentRoomData) ?
                    <VideoList roomName={currentRoomData.name}
                        streams={currentRoomData.remoteStreams}
                        localStream={currentRoomData.localStream}
                        controlVideo={controlVideo}
                        viewerCounts={currentRoomData.viewers?.length}
                    />
                    : null
                }
                
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
                        {
                            (roomsStatus === 'resolved') ?
                            <>
                                <StyledTabs value={roomIndex}
                                    variant="scrollable"
                                    scrollButtons="auto"
                                    aria-label='scrollable-auto-tab'
                                    aria-label="scrollable force tabs example"
                                >
                                    {
                                        roomsData.map((item, index) => (
                                            <StyledTab
                                                key={item.name} label={<span>{item.name}</span>}
                                                id={`scrollable-auto-tabpanel-${index}`}
                                                aria-labelledby={`scrollable-auto-tab-${index}`}
                                                onClick={() => handleChangeRoom(index)}
                                                unRead={item.unReadMessages ? item.unReadMessages.length: 0}
                                                onClose={roomsData.length < 2 ? null: () => {leaveRoomByUser(item.name)}}
                                            />
                                        ))
                                    }
                                </StyledTabs>
                                <AddRoomModal addRoom={addRoom}/>
                            </>
                            :
                            <Loading />
                        }
                        </div>
                    </AppBar>
                    <Hidden smUp implementation="css">
                        { mobileOpen &&
                            <Card className={classes.modbileDrawer}>
                            { (status === 'resolved' && currentRoomData) ?
                                <SideBarLeft
                                    users={currentRoomData.users}
                                    viewers={currentRoomData.viewers}
                                    changeMuteState={changeMuteState}
                                    sendPokeMessage={sendPokeMessage}
                                    kickUser={kickUser}
                                    banUser={banUser}
                                    roomName={currentRoomData.name}
                                    mutes={currentRoomData.mutes}
                                    blocks={currentRoomData.blocks}
                                    globalBlocks={globalBlocks}
                                    cameraBans={currentRoomData.cameraBans}
                                    globalCameraBans={globalCameraBans}
                                    addOrOpenPrivate={addOrOpenPrivate}
                                    cameraState={currentRoomData.localStream? (currentRoomData.localStream.locked? 'locked': true): false}
                                    startBroadcast={startBroadcast}
                                    stopBroadcast={stopBroadcast}
                                    stopBroadcastTo={stopBroadcastTo}
                                    viewBroadcast={viewBroadcast}
                                    username={username}
                                />  
                                : <Loading />
                            }
                            </Card>
                        }
                    </Hidden>

                    <main className={classes.main}>
                        <div className={classes.content}>
                        { (status === 'resolved' && currentRoomData) ?
                            <ChatRoomContent
                                username={username}
                                roomName={currentRoomData.name}
                                mutes={currentRoomData.mutes}
                                blocks={currentRoomData.blocks}
                                globalBlocks={globalBlocks}
                                messages={currentRoomData.messages}
                                users={currentRoomData.users}
                                sendMessage={sendMessage}
                                changeMuteState={changeMuteState}
                                sendPokeMessage={sendPokeMessage}
                                kickUser={kickUser}
                                banUser={banUser}
                                addOrOpenPrivate={addOrOpenPrivate}
                            />
                            :
                            <Loading />
                        }
                        </div>
                    </main>
                </div>
                {/* <>
                {
                    (status === 'resolved' && currentRoomData) ?
                    <VideoList roomName={currentRoomData.name}
                        streams={currentRoomData.remoteStreams}
                        localStream={currentRoomData.localStream}
                        controlVideo={controlVideo}
                        viewerCounts={currentRoomData.viewers?.length}
                    />
                    : null
                }
                </> */}
            </div>
            </div>
            <PrivateChatList ref={privateListRef}
                sendMessage={sendMessage}
                leaveFromPrivate={leaveFromPrivate}
                me={{username, avatar, gender}}
                globalBlocks={globalBlocks}
            />
            <div>{pokeAudio1}</div>
            <div>{pokeAudio2}</div>
            <div>{pokeAudio3}</div>
            <div>{pokeAudio4}</div>
            <div>{publicAudio}</div>
            <div>{privateAudio}</div>
            <div>{requestAudio}</div>
            <DisconnectModal
                open={openDisconnectModal}
                setOpen={setOpenDisconnectModal}
            />
            <PasswordModal
                open={openPasswordModal}
                setOpen={setOpenPasswordModal}
                room={roomNameForPassword}
            />
            <GiftModal/>
            <GiftView gift={gift} setGift={setGift} />
        </ChatContext.Provider>
    );
}
export default forwardRef(ChatRooms);
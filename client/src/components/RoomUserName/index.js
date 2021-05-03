import React, { useState } from 'react';
import {
    Avatar,
    Popover,
    Card,
    CardMedia,
    Button,
    Divider,
    Badge,
} from '@material-ui/core';
import {
    QuestionAnswer,
    AccountCircleOutlined,
    Videocam,
    Block,
    Check,
    Notifications,
    StarRounded,
    VisibilityOff
} from '@material-ui/icons';
import {useTranslation} from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';
import { pink } from '@material-ui/core/colors';
import BanModal from '../Modals/BanModal';
import {socket} from '../../utils'
import config from '../../config';
const useStyles = makeStyles((theme) => ({
    username: {
        fontWeight: 'bold',
        fontSize: '1.1em',
        lineHeight: 1.3,
        cursor: 'pointer',
        overflow: 'hidden',
        display: 'flex',
    },
    cardRoot: {
        width: 200,
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        height: 100,
        width: 200,
        backgroundImage: '/img/public_chat.png',
    },
    cardButton: {
        borderRadius: '0',
        height: 40,
        textTransform: 'none',
    },
    mute: {
        color: pink[500],
        textTransform: 'none',
    },
    kick: {
        color: pink[500],
        textTransform: 'none',
    },
}))

const RoomUserName = ({user, role, roomName,
    changeMuteState, sendPokeMessage, kickUser, banUser,addOrOpenPrivate, viewBroadcast, stopBroadcastTo,
    isMine, displayYou, isMuted, isBlocked
    // open,
    // anchorEl,
    // setAnchorEl,
    // handleClose
}) => { 
    const classes = useStyles();
    const {t} = useTranslation();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openBan, setOpenBan] = React.useState(false);
    const handleClickPrivateChat = (event) => {
        setAnchorEl(null);
        event.preventDefault();
        setTimeout(() => {
            addOrOpenPrivate(user);
        }, 0);
    }
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleMute = () => {
        setAnchorEl(null);
        setTimeout(() => {
            changeMuteState(roomName, user, isMuted);
        }, 0)
    }
    //block a user
    const blockUser = () => {
        socket.emit('block user', {room: roomName, username: user.username},
        (result, message) => {
            if(!result) {
                // enqueueSnackbar(message, {variant: 'error'});
            }
        })
    } 
    const unBlockUser = (roomName, username) => {

        socket.emit('unblock user', {room: roomName, username: user.username},
            (result, message) => {
                if(!result) {
                    // enqueueSnackbar(message, {variant: 'error'});
                }
            }
        );
        
    }
    const handleBlock = () => {
        if(!isBlocked) {
            blockUser(roomName, user.username);
        } else {
            unBlockUser(roomName, user.username);
        }
        setAnchorEl(null);
    }
    const handleKick = () => {
        setAnchorEl(null);
        setTimeout(() => {
            kickUser(roomName, user.username);
        }, 0)
    }
    const handleBan = () => {
        setAnchorEl(null);
        if(role === 'admin' || role === 'super_admin') {
            setOpenBan(true);
        } else {
            setTimeout(() => {
                if(role)
                banUser(roomName, user);
            }, 0);
        }
    }

    const handleClickProfile = () => {
        if(user && user.username)
            window.open('/profile/'+user.username);
        setAnchorEl(null);
    }

    const sendPoke = () => {
        setAnchorEl(null);
        setTimeout(() => {
            sendPokeMessage(roomName, user.username);
        }, 0)
        
    }

    const view = () => {
        setAnchorEl(null);
        setTimeout(() => {
            viewBroadcast(roomName, user._id, user.username);
        }, 0);
    }

    const stopView = () => {
        setAnchorEl(null);
        setTimeout(() => {
            stopBroadcastTo(roomName, user._id, user.username);
        }, 0);
    }

    const open = Boolean(anchorEl);

    return (
        <>
        <span onClick={handleClick} className={classes.username}>
            {user.username+((isMine && displayYou) ? ' (you)' : '')}
        </span>
        <Popover
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
        >
            <Card className={classes.cardRoot}>
                <CardMedia
                    className={classes.cardHeader}
                >
                    <Avatar alt="User Avatar" src={
                        user.avatar
                        ? config.main_site_url+user.avatar
                        :'/img/default_avatar.png'
                    } />
                    <span>{user.username}</span>
                    {/* <span>{user.gender}</span> */}
                </CardMedia>
                <Divider />
                <Button size="small" color="primary" fullWidth className={classes.cardButton} onClick={handleClickProfile}>
                    <AccountCircleOutlined />&nbsp;{t('UserActionArea.view_profile')}
                </Button>
                { !isMine &&
                    <>
                        <Divider />
                        <Button size="small"
                            color="primary"
                            fullWidth
                            className={classes.cardButton}
                            onClick={ handleClickPrivateChat}
                        >
                            <QuestionAnswer />&nbsp;{t('UserActionArea.message')}
                        </Button>
                        <Button size="small" fullWidth
                            color="primary"
                            className={classes.cardButton}
                            onClick={() => {sendPoke()}}
                        >
                            <Notifications />&nbsp;{t('UserActionArea.poke')}
                        </Button>
                        <Button size="small" fullWidth
                            color="primary"
                            className={classes.cardButton}
                            onClick={() => {view()}}
                        >
                            <Videocam />&nbsp;{t('UserActionArea.view')}
                        </Button>
                        <Button size="small" fullWidth
                            color="primary"
                            className={classes.cardButton}
                            onClick={() => {stopView()}}
                        >
                            <VisibilityOff />&nbsp;{t('UserActionArea.stopView')}
                        </Button>
                        <Divider />
                        { ((role === 'super_admin' || role === 'admin' || role === 'owner' || role === 'moderator')
                            && (user.role !== 'super_admin') && (user.role !== 'admin') && (user.role !== 'owner')) ?
                            <>
                            <Button size="small"
                                className={`${classes.cardButton} ${classes.kick}`}
                                fullWidth onClick={() => { handleBan() }}
                                name={user.username}
                            >
                                {t('UserActionArea.ban_from_room')}
                            </Button>
                            <Button size="small"
                                    className={`${classes.cardButton} ${classes.kick}`}
                                    fullWidth onClick={() => { handleKick() }}
                                    name={user.username}
                                >
                                    {t('UserActionArea.kick_from_room')}
                            </Button>
                            <Button size="small"
                                className={`${classes.cardButton} ${classes.mute}`}
                                fullWidth onClick={handleBlock}
                                name={user.username}
                            >
                            {
                                isBlocked
                                ? t('UserActionArea.unblock_this_person')
                                : t('UserActionArea.block_this_person')
                            }
                            </Button>
                            </>
                        :
                            (
                            <Button size="small"
                                className={`${classes.cardButton} ${classes.mute}`}
                                fullWidth onClick={() => { handleMute() }}
                                name={user.username}
                            >
                            {
                                isMuted
                                ? t('UserActionArea.unmute_this_person')
                                : t('UserActionArea.mute_this_person')
                            }
                            </Button>)
                        }
                    </>
                }
            </Card>
        </Popover>
        {(role === 'admin' || role === 'super_admin')&& <BanModal open={openBan} setOpen={setOpenBan} initVal={{name: user.username}}
            roomName={roomName}
        />
        }
        </>
    )
}

export default RoomUserName;
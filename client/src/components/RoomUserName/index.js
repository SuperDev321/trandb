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
    StarRounded
} from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { pink } from '@material-ui/core/colors';
import BanModal from '../BanModal';
const useStyles = makeStyles((theme) => ({
    username: {
        font: 'bold 14px sans-serif',
        cursor: 'pointer',
        // flexGrow: 1,
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
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
    changeMuteState, sendPokeMessage, kickUser, banUser,addOrOpenPrivate, isMine, displayYou,
    // open,
    // anchorEl,
    // setAnchorEl,
    // handleClose
}) => { 
    const classes = useStyles();
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
    const handleMute = (username) => {
        setAnchorEl(null);
        setTimeout(() => {
            changeMuteState(roomName, username);
        }, 0)
    }
    const handleKick = (username) => {
        setAnchorEl(null);
        setTimeout(() => {
            kickUser(roomName, username);
        }, 0)
    }
    const handleBan = (username) => {
        setAnchorEl(null);
        if(role === 'admin') {
            setOpenBan(true);
        } else {
            setTimeout(() => {
                if(role)
                banUser(roomName, username);
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
                        ? user.avatar
                        :'/img/default_avatar.png'
                    } />
                    <span>{user.username}</span>
                    {/* <span>{user.gender}</span> */}
                </CardMedia>
                <Divider />
                <Button size="small" color="primary" fullWidth className={classes.cardButton} onClick={handleClickProfile}>
                    <AccountCircleOutlined />&nbsp;Profile
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
                            <QuestionAnswer />&nbsp;Private Chat
                        </Button>
                        <Button size="small" fullWidth
                            color="primary"
                            className={classes.cardButton}
                            onClick={() => {sendPoke()}}
                        >
                            <Notifications />&nbsp;Poke Message
                        </Button>
                        <Divider />
                        { (role === 'admin' || role === 'owner' || role === 'moderator')
                            && (user.role !== 'admin') && (user.role !== 'owner') &&
                            <>
                            <Button size="small"
                                className={`${classes.cardButton} ${classes.kick}`}
                                fullWidth onClick={() => { handleBan(user.username) }}
                                name={user.username}
                            >
                                Ban/Block
                            </Button>
                            <Button size="small"
                                    className={`${classes.cardButton} ${classes.kick}`}
                                    fullWidth onClick={() => { handleKick(user.username) }}
                                    name={user.username}
                                >
                                    Kick
                            </Button>
                            </>
                        }
                        <Button size="small"
                            className={`${classes.cardButton} ${classes.mute}`}
                            fullWidth onClick={() => { handleMute(user.username) }}
                            name={user.username}
                        >
                        {
                            user.muted
                            ? 'Unmute / Ignore'
                            : 'Silence / Ignorance'
                        }
                        </Button>
                    </>
                }
            </Card>
        </Popover>
         <BanModal open={openBan} setOpen={setOpenBan} initVal={{name: user.username, ip: user.ip}} 
            roomName={roomName}
        />
        </>
    )
}

export default RoomUserName;